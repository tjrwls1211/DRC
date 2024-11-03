import sys
import time
import threading
import RPi.GPIO as GPIO
from datetime import datetime
from hx711 import HX711
import paho.mqtt.client as mqtt
from PyQt5.QtWidgets import QApplication, QWidget, QLabel, QVBoxLayout, QHBoxLayout
from PyQt5.QtCore import QTimer, Qt
from PyQt5.QtGui import QPixmap, QTransform, QFont, QPainter
import pygame
import json
from server import ip, port

# 서버 URL 설정
url = f'http://{ip()}:{port()}/data'

# 데이터 구조 정의
data = {
    "carId": "01가1234",
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

# 음성 초기화 및 파일 로드
pygame.mixer.init()

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

# 음성 재생 중단 및 상태 플래그
stop_sounds = False
is_playing_sounds = False

# 음성 재생 함수
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

# 사용자 정의 QLabel 클래스 (상하좌우 반전된 텍스트 출력)
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

# GUI 클래스
class CarDisplay(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Car Driving Display")
        self.setGeometry(100, 100, 1000, 600)
        self.setStyleSheet("background-color: black;")

        # 메인 레이아웃
        main_layout = QVBoxLayout()

        # 상단 레이아웃
        top_layout = QHBoxLayout()

        # 브레이크 이미지 (왼쪽 상단)
        self.brake_pixmap_normal = QPixmap("brake_normal.png").transformed(QTransform().scale(-1, -1))
        self.brake_pixmap_dark = QPixmap("brake_dark.png").transformed(QTransform().scale(-1, -1))
        self.brake_label = QLabel()
        self.brake_label.setPixmap(self.brake_pixmap_normal)
        top_layout.addWidget(self.brake_label, alignment=Qt.AlignLeft | Qt.AlignTop)

        # 엑셀 이미지 (오른쪽 상단)
        self.accel_pixmap_normal = QPixmap("accel_normal.png").transformed(QTransform().scale(-1, -1))
        self.accel_pixmap_dark = QPixmap("accel_dark.png").transformed(QTransform().scale(-1, -1))
        self.accel_label = QLabel()
        self.accel_label.setPixmap(self.accel_pixmap_normal)
        top_layout.addWidget(self.accel_label, alignment=Qt.AlignRight | Qt.AlignTop)

        # 상단 레이아웃 추가
        main_layout.addLayout(top_layout)

        # 중앙 텍스트 레이아웃
        self.speed_label = FlippedTextLabel("속도: 0", self)
        main_layout.addWidget(self.speed_label, alignment=Qt.AlignCenter)

        # 레이아웃 설정
        self.setLayout(main_layout)

        # 주기적으로 디스플레이 업데이트
        self.timer = QTimer()
        self.timer.timeout.connect(self.update_display)
        self.timer.start(1000)

    def update_display(self):
        # 중앙 하단에 "aclPedal" 값 출력
        flipped_speed = str(data['aclPedal'])
        self.speed_label.set_flipped_text(f"속도: {flipped_speed}")

    def update_images(self, accel_value, brake_value):
        # 조건에 따라 엑셀 및 브레이크 이미지 업데이트
        if accel_value <= 30:
            self.accel_label.setPixmap(self.accel_pixmap_dark)
        else:
            self.accel_label.setPixmap(self.accel_pixmap_normal)

        if brake_value <= 30:
            self.brake_label.setPixmap(self.brake_pixmap_dark)
        else:
            self.brake_label.setPixmap(self.brake_pixmap_normal)

prev_mqtt_state = None

def check_info(accel_value, brake_value, window):
    global last_accel_time, is_accelerating, stop_sounds, is_playing_sounds, prev_mqtt_state

    mqtt_state = None

    # 급발진 상태
    if accel_value > 200 and brake_value <= 30:
        state = "Rapid Acceleration"
        window.update_images(accel_value, brake_value)
        mqtt_state = 1

        if not is_accelerating:
            last_accel_time = time.time()
            is_accelerating = True
        else:
            elapsed_time = time.time() - last_accel_time
            if elapsed_time >= 4 and not is_playing_sounds:
                stop_sounds = True  
                time.sleep(0.2)  # 이전 스레드 종료 대기
                
                # 모든 음성 파일을 순차 재생
                sounds = [
                    rapidspeed_1_sound, rapidspeed_2_sound, rapidspeed_3_sound,
                    nobrake_1_sound, nobrake_2_sound, nobrake_3_sound,
                    speedless_1_sound, speedless_2_sound,
                    carstop_1_sound, carstop_2_sound
                ]
                threading.Thread(target=play_sounds_in_sequence, args=(sounds,), daemon=True).start()
                last_accel_time = time.time()

    # 급정거 상태
    elif brake_value > 200 and accel_value <= 30:
        state = "Rapid Braking"
        window.update_images(accel_value, brake_value)
        mqtt_state = 2
        is_accelerating = False
        stop_sounds = True  # 음성 중단

    # 양발 운전 상태
    elif accel_value > 100 and brake_value > 100:
        state = "Both Feet Driving"
        window.update_images(accel_value, brake_value)
        mqtt_state = 3
        is_accelerating = False
        stop_sounds = True  # 음성 중단

    # 일반 주행 상태
    else:
        state = "Normal Driving"
        window.update_images(accel_value, brake_value)
        is_accelerating = False
        stop_sounds = True  # 음성 중단

    # 상태가 변경되고 mqtt_state가 None이 아닐 때만 MQTT 전송    
    if mqtt_state is not None and mqtt_state != prev_mqtt_state:
        alert_data = {
            "carId": "01가1234",
            "state": mqtt_state
        }
        print(alert_data)
        client.publish('AbnormalDriving', json.dumps(alert_data), 0, retain=False)
        prev_mqtt_state = mqtt_state  # 이전 상태 갱신

# 음성 재생 함수 수정 (중단 기능 포함)
def play_sounds_in_sequence(sounds):
    global stop_sounds, is_playing_sounds
    stop_sounds = False
    is_playing_sounds = True

    for sound in sounds:
        if stop_sounds:  # 상태 변화 시 재생 중단
            break
        sound.play()
        while pygame.mixer.get_busy():  # 현재 믹서에서 사운드가 재생 중인지 확인
            if stop_sounds:
                pygame.mixer.stop()  # 재생 중단
                break
            time.sleep(0.1)  # 비차단 대기
        time.sleep(3)  # 사운드 간 간격

    is_playing_sounds = False


# 주행 데이터 수집 및 디스플레이 업데이트
def run_code(window):
    while True:
        try:
            val_accelerator = hx1.get_weight(5)
            val_brake = hx2.get_weight(5)
            hx1.power_down()
            hx2.power_down()
            hx1.power_up()
            hx2.power_up()

            now = datetime.now()
            data.update({
                "carId": "01가1234",
                "aclPedal": int(val_accelerator),
                "brkPedal": int(val_brake),
                "createdAt": now.strftime('%Y-%m-%dT%H:%M:%S'),
                "speed": 40,
                "rpm": 2000
            })

            client.publish('pedal', json.dumps(data), 0, retain=False)
            print(data)
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
