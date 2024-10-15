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

ip = 
port = 

url = f'http://{ip}:{port}/data'

data = {
    "carId": 0,
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
data["carId"]=1234


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
root.title("Data Display")
root.geometry("1080x720")

# 레이블 생성
label = tk.Label(root, text="Reading data....", font=("Georgia", 40))
label.pack(pady=20)

# pygame 초기화
pygame.mixer.init()

# 음성 재생 시간 기록
last_accel_time = 0
is_accelerating = False

# 조건 생성 및 음성 재생
def check_info(accel_value, brake_value):
    global last_accel_time, is_accelerating
    
    if accel_value > 100 and brake_value <= 50:
        # 급가속 조건
        label.config(text="Rapid Acceleration(급가속)")
        
        if not is_accelerating:
            last_accel_time = time.time()  # 현재 시간 기록
            is_accelerating = True
        else:
            elapsed_time = time.time() - last_accel_time  # 경과 시간 계산
            if elapsed_time >= 3:  # 3초 이상 유지될 경우
                pygame.mixer.music.load("rapid_acceleration.wav")
                pygame.mixer.music.play()
                last_accel_time = time.time()  # 시간 업데이트

    elif brake_value > 100 and accel_value <= 50:
        # 급정거 조건
        label.config(text="Rapid Braking(급정거)")
        is_accelerating = False  # 급가속 상태 초기화

    elif accel_value > 50 and brake_value > 50:
        # 양발운전 조건
        label.config(text="Both Feet Driving(양발운전)")
        is_accelerating = False  # 급가속 상태 초기화

    else:
        # 정상 주행 중
        label.config(text="Normal Driving(정상주행중)")
        is_accelerating = False  # 급가속 상태 초기화

print("Tare done! Add weight now...")

client = mqtt.Client()
client.connect(ip, 1222, 60)

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

            root.after(0, check_info, val_accelerator, val_brake)

            time.sleep(1)

        except Exception as error:
            print(error)
            continue

threading.Thread(target=run_code, daemon=True).start()
root.mainloop()