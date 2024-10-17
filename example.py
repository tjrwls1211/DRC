import time
import sys
import RPi.GPIO as GPIO
import requests
from datetime import datetime
from hx711 import HX711
import paho.mqtt.client as mqtt
import json
import tkinter as tk
import threading
import pygame

# IP 및 포트 정보 설정
ip = "your_ip_here"  # 여기에 IP 주소 입력
port = "your_port_here"  # 여기에 포트 번호 입력

# 서버 URL 설정
url = f'http://{ip}:{port}/data'

# 데이터 구조 정의
data = {
    "carId": 1234,  # 차량 ID 설정
    "aclPedal": 0,
    "brkPedal": 0,
    "createdAt": 0,
    "driveState": "",
}

def cleanAndExit():
    print("Cleaning...")
    GPIO.cleanup()  # GPIO 핀 해제
    print("Bye!")
    sys.exit()

# 첫 번째 HX711 - 엑셀(Accelerator)
hx1 = HX711(20, 16)
# 두 번째 HX711 - 브레이크(Brake)
hx2 = HX711(6, 5)

# MSB 순서로 설정
hx1.set_reading_format("MSB", "MSB")
hx2.set_reading_format("MSB", "MSB")

# 참조 단위 설정 (로드셀 보정값)
referenceUnit = 96
hx1.set_reference_unit(referenceUnit)
hx2.set_reference_unit(referenceUnit)

# 초기화 및 영점 설정
hx1.reset()
hx2.reset()
hx1.tare()
hx2.tare()

# Tkinter 창생성
root = tk.Tk()
root.title("Car Driving Display")
root.geometry("1080x720")
root.configure(bg="black")

# 폰트 설정
font_large = ("Arial", 40, "bold")
font_medium = ("Arial", 30, "bold")
font_small = ("Arial", 20)

# 상태에 따라 색상을 변경하는 함수
def set_display_state(state):
    if state == "Rapid Acceleration":
        label.config(text="Rapid Acceleration (급가속)", fg="red")
        root.configure(bg="black")
    elif state == "Rapid Braking":
        label.config(text="Rapid Braking (급정거)", fg="blue")
        root.configure(bg="black")
    elif state == "Both Feet Driving":
        label.config(text="Both Feet Driving (양발운전)", fg="yellow")
        root.configure(bg="black")
    else:
        label.config(text="Normal Driving (정상주행중)", fg="green")
        root.configure(bg="black")

# 메인 레이블
label = tk.Label(root, text="Normal Driving (정상주행중)", font=font_large, fg="green", bg="black")
label.pack(pady=60)

# pygame 초기화
pygame.mixer.init()

# 음성 재생 시간 기록
last_accel_time = 0
is_accelerating = False

# MQTT 설정
client = mqtt.Client()
client.connect(ip, 1222, 60)

# 로드셀 데이터와 상태를 업데이트하는 함수
def check_info(accel_value, brake_value):
    global last_accel_time, is_accelerating

    if accel_value > 100 and brake_value <= 50:
        data["driveState"] = "Rapid Acceleration"
        set_display_state("Rapid Acceleration")

        if not is_accelerating:
            last_accel_time = time.time()
            is_accelerating = True
        else:
            elapsed_time = time.time() - last_accel_time
            if elapsed_time >= 3:  # 3초 이상 급가속 상태일 경우
                pygame.mixer.music.load("rapid_acceleration.mp3")
                pygame.mixer.music.play()
                last_accel_time = time.time()

    elif brake_value > 100 and accel_value <= 50:
        data["driveState"] = "Rapid Braking"
        set_display_state("Rapid Braking")
        is_accelerating = False

    elif accel_value > 50 and brake_value > 50:
        data["driveState"] = "Both Feet Driving"
        set_display_state("Both Feet Driving")
        is_accelerating = False

    else:
        data["driveState"] = "Normal Driving"
        set_display_state("Normal Driving")
        is_accelerating = False

# 로드셀에서 데이터를 읽고 주행 상태를 확인하는 함수
def run_code():
    while True:
        try:
            # 첫 번째 로드셀 (엑셀)
            val_accelerator = hx1.get_weight(5)
            print(f"현재상태 : 액셀(Accelerator)  무게: {val_accelerator} g")

            # 두 번째 로드셀 (브레이크)
            val_brake = hx2.get_weight(5)
            print(f"현재상태 : 브레이크(Brake) 무게: {val_brake} g")

            hx1.power_down()
            hx2.power_down()
            hx1.power_up()
            hx2.power_up()

            data["aclPedal"] = int(val_accelerator)
            data["brkPedal"] = int(val_brake)

            # 현재 시간 추가
            now = datetime.now()
            now_format = now.strftime('%Y-%m-%dT%H:%M:%S')
            data["createdAt"] = str(now_format)
            client.publish('pedal', json.dumps(data), 0, retain=False)

            # Tkinter UI 업데이트
            check_info(val_accelerator, val_brake)  # root.after 대신 바로 호출

            time.sleep(1)

        except Exception as error:
            print(error)
            continue

# 쓰레드로 run_code 실행
threading.Thread(target=run_code, daemon=True).start()

# Tkinter 창 실행
root.mainloop()
