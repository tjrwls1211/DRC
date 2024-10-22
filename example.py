import time
import sys
import RPi.GPIO as GPIO
from datetime import datetime
from hx711 import HX711
import paho.mqtt.client as mqtt
import json
import tkinter as tk
from PIL import Image, ImageTk
import threading
import pygame
from server import ip, port


# 서버 URL 설정
url = f'http://{ip()}:{port()}/data'

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

# 이미지 로드
accel_img_normal = ImageTk.PhotoImage(Image.open("accel_normal.png").resize((450, 450)))
accel_img_dark = ImageTk.PhotoImage(Image.open("accel_dark.png").resize((450, 450)))
brake_img_normal = ImageTk.PhotoImage(Image.open("brake_normal.png").resize((450, 450)))
brake_img_dark = ImageTk.PhotoImage(Image.open("brake_dark.png").resize((450, 450)))

# 이미지 레이블 생성
accel_label = tk.Label(root, image=accel_img_dark, bg="black")
accel_label.pack(side="right", padx=20, pady=20)

brake_label = tk.Label(root, image=brake_img_dark, bg="black")
brake_label.pack(side="left", padx=20, pady=20)

# 상태 텍스트 레이블
status_label = tk.Label(root, text="Normal Driving (정상주행중)", font=font_large, fg="green", bg="black", width=20)
status_label.pack(pady=20)

# pygame 초기화
# pygame.mixer.init()

#테스트 파일 
try:
    pygame.mixer.init()
except pygame.error as e:
    print(f"오디오 초기화 실패: {e}")


# 음성 재생 시간 기록
last_accel_time = 0
is_accelerating = False

# MQTT 설정
client = mqtt.Client()
client.connect(ip(), 1222, 60)

# 상태 업데이트 및 이미지 전환 함수
def update_display_state(accel_value, brake_value, state):
    # 이미지와 텍스트 상태 업데이트
    if accel_value < 30:
        accel_label.config(image=accel_img_dark)
        accel_text_label.config(text="")
    else:
        accel_label.config(image=accel_img_normal)

    if brake_value < 30:
        brake_label.config(image=brake_img_dark)
        brake_text_label.config(text="")
    else:
        brake_label.config(image=brake_img_normal)
'''
    # 상태에 따른 텍스트 업데이트
    if state == "Rapid Acceleration":
        status_label.config(text="Rapid Acceleration (급가속)", fg="red")
        accel_text_label.config(text="과속", fg="red", bg="transparent")
    elif state == "Rapid Braking":
        status_label.config(text="Rapid Braking (급정거)", fg="blue")
        brake_text_label.config(text="급브레이크", fg="blue", bg="transparent")
    elif state == "Both Feet Driving":
        status_label.config(text="Both Feet Driving (양발운전)", fg="yellow")
        accel_text_label.config(text="양발운전", fg="yellow", bg="transparent")
        brake_text_label.config(text="양발운전", fg="yellow", bg="transparent")
    else:
        status_label.config(text="Normal Driving (정상주행중)", fg="green")
'''
'''
# 이미지 위에 텍스트 표시를 위한 레이블 생성
accel_text_label = tk.Label(root, text="", font=font_large, bg="transparent", fg="red")
accel_text_label.place(relx=0.25, rely=0.4, anchor='center')  # 중앙에 위치

brake_text_label = tk.Label(root, text="", font=font_large, bg="transparent", fg="blue")
brake_text_label.place(relx=0.75, rely=0.4, anchor='center')  # 중앙에 위치
'''
# TEST

#미리 로드 만들어두기
rapid_acceleration_sound = pygame.mixer_sound = pygame.mixer.Sound("rapid_acceleration.wav")


# 로드셀 데이터와 상태를 업데이트하는 함수
def check_info(accel_value, brake_value):
    global last_accel_time, is_accelerating

    if accel_value > 200 and brake_value <= 30:
        data["driveState"] = "Rapid Acceleration"
        update_display_state(accel_value, brake_value, "Rapid Acceleration") 

        if not is_accelerating:
            last_accel_time = time.time()
            is_accelerating = True
        else:
            elapsed_time = time.time() - last_accel_time
            if elapsed_time >= 4 and not pygame.mixer.music.get_busy(): 
                rapid_acceleration_sound.play() 
                
                rapid_acceleration_sound.play()
                time.sleep(1.5)
                
                
                '''
                rapid_acceleration_sound.play()
                time.sleep(1.5)
                rapid_acceleration_sound.play()
                time.sleep(1.5)
                rapid_acceleration_sound.play()
                time.sleep(1.5)
                rapid_acceleration_sound.play()
                time.sleep(1.5)
                rapid_acceleration_sound.play()
                time.sleep(1.5)
                rapid_acceleration_sound.play()
                time.sleep(1.5)
                rapid_acceleration_sound.play()
                time.sleep(1.5)
                rapid_acceleration_sound.play()
                time.sleep(1.5)
                rapid_acceleration_sound.play()
                time.sleep(1.5)
                rapid_acceleration_sound.play()
                time.sleep(1.5)
                '''
                last_accel_time = time.time()

    elif brake_value > 200 and accel_value <= 30:
        data["driveState"] = "Rapid Braking" 
        update_display_state(accel_value, brake_value, "Rapid Braking")
        is_accelerating = False

    elif accel_value > 100 and brake_value > 100:
        data["driveState"] = "Both Feet Driving"
        update_display_state(accel_value, brake_value, "Both Feet Driving")
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
            check_info(val_accelerator, val_brake)

            time.sleep(1)

        except Exception as error:
            print(error)
            continue

# 쓰레드로 run_code 실행
threading.Thread(target=run_code, daemon=True).start()

# Tkinter 창 실행
root.mainloop()
