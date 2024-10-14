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
hx1 = HX711(20, 16)  # 첫 번째 HX711의 데이터 핀과 클럭 핀
# 두 번째 HX711 - 브레이크(Brake) 첫번째 완성후 넘어갈것
hx2 = HX711(6, 5)  # 두 번째 HX711의 데이터 핀과 클럭 핀

# MSB 순서로 설정
hx1.set_reading_format("MSB", "MSB")
hx2.set_reading_format("MSB", "MSB") #첫번째 완성후 넘어갈것

# 참조 단위 설정 (로드셀 보정값)
referenceUnit = 96
hx1.set_reference_unit(referenceUnit)
hx2.set_reference_unit(referenceUnit) #첫번째 완성후 넘어갈것

# 초기화 및 영점 설정
hx1.reset()
hx2.reset() #첫번째 완성후 넘어갈것

hx1.tare()
hx2.tare() #첫번째 완성후 넘어갈것

# Tkinter 창생성
root = tk.Tk()
root.title("Data Display")
root.geometry("1080x720")

#레이블 생성
label = tk.Label(root, text="Reading data....", font=("Georgia", 40))
label.pack(pady=20)


#조건생성
def check_info(accel_value, brake_value):
    if accel_value > 100 and brake_value <= 50:
        drive_state = "Rapid Acceleration(급가속)"
    elif brake_value > 100 and accel_value <= 50:
        drive_state = "Rapid Braking(급정거)"
    elif accel_value > 50 and brake_value > 50:
        drive_state = "Both Feet Driving(양발운전)"
    else:
        drive_state = "Normal Driving(정상주행중)"


print("Tare done! Add weight now...")

client = mqtt.Client()

client.connect(ip, 1222, 60)

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

            data["aclPedal"]=int(val_accelerator)
            data["brkPedal"]=int(val_brake)
            now = datetime.now()
            now_format = now.strftime('%Y-%m-%dT%H:%M:%S')
            data["createdAt"]=str(now_format)
            #requests.post(url, json=data)
            client.publish('pedal', json.dumps(data), 0, retain=False)

            root.after(0, check_info, val_accelerator, val_brake)

            time.sleep(1)

        except Exception as error:
            print(error)
            continue
threading.Thread(target=run_code, daemon=True).start()
root.mainloop()
