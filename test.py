import sys
import time
import threading
import requests
from datetime import datetime
import RPi.GPIO as GPIO
from hx711 import HX711
import paho.mqtt.client as mqtt
from PyQt5.QtWidgets import QApplication, QWidget, QLabel, QVBoxLayout, QHBoxLayout
from PyQt5.QtCore import QTimer, Qt
from PyQt5.QtGui import QPixmap, QTransform, QFont, QPainter
import pygame
import json
from server import ip, port
import obd

# 서버 URL 설정
url = f'http://{ip()}:{port()}/data'

# 데이터 구조 정의
data = {
    "carId": 1234,
    "aclPedal": 0,
    "brkPedal": 0,
    "createdAt": 0,
    "driveState": "",
    "speed": 50,
    "rpm": 2000
}

# GPIO 및 HX711 설정
hx1 = HX711(20, 16)
hx2 = HX711(6, 5)
hx1.set_reading_format("MSB", "MSB")
hx2.set_reading_format("MSB", "MSB")
referenceUnit = 96
hx1.set_reference_unit(referenceUnit)
hx2.set_reference_unit(referenceUnit)
hx1.reset()
hx2.reset()
hx1.tare()
hx2.tare()

# MQTT 설정
client = mqtt.Client()
client.connect(ip(), 1222, 60)

pygame.mixer.init()

# 음성 파일 로드
rapidspeed_1_sound = pygame.mixer.Sound("rapidspeed_1.wav")
rapidspeed_2_sound = pygame.mixer.Sound("rapidspeed_2.wav")
rapidspeed_3_sound = pygame.mixer.Sound("rapidspeed_3.wav")
nobrake_1_sound = pygame.mixer.Sound("nobrake_1.wav")
nobrake_2_sound = pygame.mixer.Sound("nobrake_2.wav")
nobrake_3_sound = pygame.mixer.Sound("nobrake_3.wav")

speedless_1_sound = pygame.mixer.Sound("speedless_1.wav")
speedless_2_sound = pygame.mixer.Sound("speedless_2.wav")
carstop_1_sound = pygame.mixer.Sound("carstop_1.wav")
carstop_2_sound = pygame.mixer.Sound("carstop_2.wav")

# 음성 재생 및 중단 제어
stop_sounds = False
is_playing_sounds = False

def play_sounds_in_sequence(sounds):
    global stop_sounds, is_playing_sounds
    stop_sounds = False
    is_playing_sounds = True

    for sound in sounds:
        if stop_sounds:
            break
        sound.play()
        while sound.get_busy():
            if stop_sounds:
                sound.stop()
                break
            time.sleep(0.1)
        time.sleep(3)

    is_playing_sounds = False

# PyQt를 통한 GUI 구현
class FlippedTextLabel(QLabel):
    def __init__(self, text, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.text = text
        self.setFont(QFont("Arial", 40))
        self.setStyleSheet("background-color: black; color: white;")

    def set_flipped_text(self, text):
        self.text = text
        self.update()

    def paintEvent(self, event):
        painter = QPainter(self)
        painter.setFont(self.font())
        painter.setRenderHint(QPainter.Antialiasing)
        painter.translate(self.width(), self.height())
        painter.rotate(180)  # 상하 반전
        painter.drawText(-self.width(), -self.height() + 50, self.text[::-1])  # 좌우 반전
        painter.end()

class CarDisplay(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Car Driving Display")
        self.setGeometry(100, 100, 1000, 600)
        self.setStyleSheet("background-color: black;")

        main_layout = QVBoxLayout()

        # 상단 이미지 레이아웃
        top_layout = QHBoxLayout()

        # 브레이크 이미지 (상하좌우 반전)
        self.brake_pixmap_normal = QPixmap("brake_normal.png").transformed(QTransform().scale(-1, -1))
        self.brake_pixmap_dark = QPixmap("brake_dark.png").transformed(QTransform().scale(-1, -1))
        self.brake_label = QLabel()
        self.brake_label.setPixmap(self.brake_pixmap_normal)
        top_layout.addWidget(self.brake_label, alignment=Qt.AlignLeft)

        # 엑셀 이미지 (상하좌우 반전)
        self.accel_pixmap_normal = QPixmap("accel_normal.png").transformed(QTransform().scale(-1, -1))
        self.accel_pixmap_dark = QPixmap("accel_dark.png").transformed(QTransform().scale(-1, -1))
        self.accel_label = QLabel()
        self.accel_label.setPixmap(self.accel_pixmap_normal)
        top_layout.addWidget(self.accel_label, alignment=Qt.AlignRight)

        main_layout.addLayout(top_layout)

        # 속도 텍스트 (상하좌우 반전된 텍스트)
        self.speed_label = FlippedTextLabel("속도: 0")
        main_layout.addWidget(self.speed_label, alignment=Qt.AlignCenter)

        self.setLayout(main_layout)

        self.timer = QTimer()
        self.timer.timeout.connect(self.update_display)
        self.timer.start(1000)

    def update_display(self):
        flipped_speed = str(data['aclPedal'])
        self.speed_label.set_flipped_text(f"속도: {flipped_speed}")

    def update_images(self, accel_value, brake_value):
        if accel_value <= 30:
            self.accel_label.setPixmap(self.accel_pixmap_dark)
        else:
            self.accel_label.setPixmap(self.accel_pixmap_normal)

        if brake_value <= 30:
            self.brake_label.setPixmap(self.brake_pixmap_dark)
        else:
            self.brake_label.setPixmap(self.brake_pixmap_normal)

def check_info(accel_value, brake_value, window):
    window.update_images(accel_value, brake_value)

    global stop_sounds
    stop_sounds = True  # 이전 음성 재생 중단

    # 상태 및 MQTT 메시지 전송
    state = "Normal Driving"
    mqtt_state = None

    if accel_value > 200 and brake_value <= 30:
        state = "Rapid Acceleration"
        mqtt_state = 1
        sounds = [rapidspeed_1_sound, rapidspeed_2_sound, rapidspeed_3_sound]
    elif brake_value > 200 and accel_value <= 30:
        state = "Rapid Braking"
        mqtt_state = 2
        sounds = [carstop_1_sound, carstop_2_sound]
    elif accel_value > 100 and brake_value > 100:
        state = "Both Feet Driving"
        mqtt_state = 3
        sounds = [nobrake_1_sound, nobrake_2_sound, nobrake_3_sound]

    # 음성 재생
    if mqtt_state is not None:
        threading.Thread(target=play_sounds_in_sequence, args=(sounds,), daemon=True).start()

        alert_data = {
            "carId": 1234,
            "state": mqtt_state
        }
        print(alert_data)
        client.publish('AbnormalDriving', json.dumps(alert_data), 0, retain=False)

def run_code(window):
    while True:
        try:
            val_accelerator = hx1.get_weight(5)
            val_brake = hx2.get_weight(5)
            hx1.power_down()
            hx2.power_down()
            hx1.power_up()
            hx2.power_up()

            # 현재 시간 추가
            now = datetime.now()
            data.update({
                "carId": 1234,
                "aclPedal": int(val_accelerator),
                "brkPedal": int(val_brake),
                "createdAt": now.strftime('%Y-%m-%dT%H:%M:%S'),
                "speed": 40,
                "rpm": 2000
            })

            client.publish('pedal', json.dumps(data), 0, retain=False)

            # HTTP POST 요청으로 데이터 전송
            response = requests.post(url, json=data)
            print(f"HTTP POST Response: {response.status_code}, {response.text}")

            check_info(val_accelerator, val_brake, window)

            time.sleep(1)

        except Exception as e:
            print(e)

if __name__ == '__main__':
    app = QApplication(sys.argv)

    window = CarDisplay()
    window.show()

    threading.Thread(target=run_code, args=(window,), daemon=True).start()

    sys.exit(app.exec_())
