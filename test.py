import time
import sys
import RPi.GPIO as GPIO
from datetime import datetime
from hx711 import HX711
import paho.mqtt.client as mqtt
import json
import tkinter as tk
from PIL import Image, ImageDraw, ImageFont, ImageTk, ImageOps
import threading
import pygame
from server import ip, port
import obd
import random
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.animation import FuncAnimation
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import pandas as pd


df = pd.read_csv("/home/drc/DRC/DRC/audi_s1.csv", sep=',')


# 서버 URL 설정
url = f'http://{ip()}:{port()}/data'

# 데이터 구조 정의
data = {
    "carId": "01가1234",  # 차량 ID 설정
    "aclPedal": 0,
    "brkPedal": 0,
    "createDate": 0,
    "driveState": " ",
    "speed" : 0,
    "rpm" : 0,
    "speedChange" : 0
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
root.geometry("1000x600")
root.configure(bg="black")

# 폰트 설정
font_large = ("Arial", 35, "bold")

# 속도 구간 설정
num_bins = 10
bin_width = 20
max_speed = 200

# 그래프 초기 설정
fig, ax = plt.subplots(figsize=(2, 6))
ax.set_ylim(0, num_bins)
ax.axis('off')
ax.set_facecolor("black")

# 초기 막대 생성
bars = [ax.bar(1, 1, bottom=i, color="lightgray", width=0.5, edgecolor='black') for i in range(num_bins)]



# 이미지 로드
accel_img_normal = ImageTk.PhotoImage(Image.open("accel_normal.png").resize((365, 500)))
accel_img_dark = ImageTk.PhotoImage(Image.open("accel_dark.png").resize((365, 500)))
brake_img_normal = ImageTk.PhotoImage(Image.open("brake_normal.png").resize((365, 500)))
brake_img_dark = ImageTk.PhotoImage(Image.open("brake_dark.png").resize((365, 500)))

# 이미지 레이블 생성
accel_label = tk.Label(root, image=accel_img_dark, bg="black")
accel_label.config(width=accel_img_normal.width(), height=accel_img_normal.height())  # 이미지 크기에 맞게 레이블 크기 설정
accel_label.place(relx=0.42, rely=0.5, anchor="center")  # 윈도우 중앙에 배치

brake_label = tk.Label(root, image=brake_img_dark, bg="black")
brake_label.config(width=brake_img_normal.width(), height=brake_img_normal.height())  # 이미지 크기에 맞게 레이블 크기 설정
brake_label.place(relx=-0.04, rely=0.5, anchor="w")  # 왼쪽 중앙에 배치


#data부분을 나중에 속도 데이터로 넣으면될꺼같음 
text_label = tk.Label(root, text=f"현재 ", font=font_large, bg="black", fg="white", padx=2, pady=10, width=9)
text_label.place(relx=0.85, rely=0.05, anchor='ne')


# pygame 초기화
pygame.mixer.init()

# 음성 재생 시간 기록
is_accelerating = False
last_sound_time = {
    "Unintended Acceleration": 0,
    "Rapid Acceleration": 0,
    "Rapid Braking": 0,
    "Both Feet Driving": 0
}

sound_delay = 3  # 음성 재생 간격
state_hold_time = 3  # 상태 유지 시간

# MQTT 설정
client = mqtt.Client()
client.connect(ip(), 1222, 60)

# 애니메이션 업데이트 함수
def update(frame):
    # CSV에서 speed_value 가져오기
    speed_value = df.iloc[frame]['Ground Speed']
    if pd.isna(speed_value):
        speed_value = 0  # 기본값 설정
    
    # 현재 레벨 계산 (0~9 범위)
    current_level = min(int(speed_value // 20), 9)  # 0~9로 제한

    # 막대 색상 업데이트
    colors = ['green', 'green', 'green', 'yellow', 'yellow', 'yellow', 'orange', 'orange', 'red', 'red']
    for i, bar in enumerate(bars):
        bar[0].set_color(colors[i] if i <= current_level else "lightgray")

    canvas.draw()  # 그래프 업데이트

# 애니메이션 실행
ani = FuncAnimation(fig, update, interval=1000)  # 1000ms마다 업데이트

# Tkinter 창에 그래프 추가
canvas = FigureCanvasTkAgg(fig, master=root)
canvas.get_tk_widget().place(relx=0.84, rely=0.2, anchor="n", width=300, height=400)

# 상태 업데이트 및 이미지 전환 함수
def update_display_state(accel_value, brake_value, state):
    global data # driveState를 초기화하려면 필요한 코드
    # 엑셀 이미지 상태 업데이트
    if accel_value <= 30:
        if accel_label.cget("image") != str(accel_img_dark):  # 같은 이미지라면 업데이트 안함
            accel_label.config(image=accel_img_dark)

    else:
        if accel_label.cget("image") != str(accel_img_normal):
            accel_label.config(image=accel_img_normal)

    # 브레이크 이미지 상태 업데이트
    if brake_value <= 30:
        if brake_label.cget("image") != str(brake_img_dark):
            brake_label.config(image=brake_img_dark)

    else:
        if brake_label.cget("image") != str(brake_img_normal):
            brake_label.config(image=brake_img_normal)

#급발진 음성
rapidspeed_1_sound = pygame.mixer.Sound("rapidspeed_1.wav")
rapidspeed_2_sound = pygame.mixer.Sound("rapidspeed_2.wav")
rapidspeed_3_sound = pygame.mixer.Sound("rapidspeed_3.wav")
rapidspeed_4_sound = pygame.mixer.Sound("rapidspeed_4.wav")
nobrake_1_sound = pygame.mixer.Sound("nobrake_1.wav")
nobrake_2_sound = pygame.mixer.Sound("nobrake_2.wav")
nobrake_3_sound = pygame.mixer.Sound("nobrake_3.wav")
speedless_1_sound = pygame.mixer.Sound("speedless_1.wav")
speedless_2_sound = pygame.mixer.Sound("speedless_2.wav")
carstop_1_sound = pygame.mixer.Sound("carstop_1.wav")
carstop_2_sound = pygame.mixer.Sound("carstop_2.wav")

#급가속 음성
accelaccel_sound = pygame.mixer.Sound("accelaccel.wav")

#급감속 음성
brakebrake_sound = pygame.mixer.Sound("brakebrake.wav")

#양발운전 
bothdrive_sound = pygame.mixer.Sound("bothdrive.wav")


# 전역 변수
stop_sounds = False
is_playing_sounds = False  # 음성 재생 중 여부 확인 플래그

# 음성을 비차단 방식으로 재생하는 함수
def play_sounds_in_sequence(sounds):
    global stop_sounds, is_playing_sounds
    stop_sounds = False
    is_playing_sounds = True  # 재생 시작 플래그 설정

    for sound in sounds:
        # 조건이 변경되면 음성 재생 중단
        if stop_sounds:
            print("음성 재생 중단")
            break

        sound.play()
        while pygame.mixer.music.get_busy():  # 현재 음성이 재생 중일 때 대기
            if stop_sounds:  # 중단 플래그 확인
                pygame.mixer.music.stop()  # 현재 재생 중인 음성도 중단
                is_playing_sounds = False  # 재생 상태 플래그 해제
                return
            time.sleep(0.1)  # 비차단 대기
        time.sleep(3)  # 음성 간 3초 간격

    is_playing_sounds = False  # 모든 음성 재생 완료 후 플래그 해제

#전역 변수로 안전 상태 저장
prev_mqtt_state = None

# 마지막으로 재생된 상태를 저장하는 변수
last_played_state = None  # 전역 변수로 설정

rpm_reached_5000 = False

def check_info(accel_value, brake_value, rpm_value):
    print("acl : ", accel_value, "brk : ", brake_value, "rpm : ", rpm_value)
    global stop_sounds, is_playing_sounds, prev_mqtt_state, prev_rpm, last_played_state, rpm_reached_5000
    mqtt_state = None
    state = "Normal Driving"

    current_time = time.time()  # 현재 시간 기록

    # Unintended Acceleration
    if 200 < accel_value < 1000 and brake_value <= 30:
        state = "Unintended Acceleration"
        update_display_state(accel_value, brake_value, state)

        elapsed_time = current_time - last_sound_time[state]
        if (state != last_played_state) and elapsed_time >= state_hold_time and elapsed_time >= sound_delay:
            stop_sounds = True
            last_played_state = state  # 마지막으로 재생된 상태 업데이트

            # RPM이 5000 이상일 때 첫 번째 음성 출력
        if rpm_value >= 5000:
                rpm_reached_5000 = True
                print("rpm 도착값", rpm_reached_5000)
                sounds = [rapidspeed_1_sound,rapidspeed_2_sound, rapidspeed_3_sound, rapidspeed_4_sound]
                threading.Thread(target=play_sounds_in_sequence, args=(sounds,), daemon=True).start()

            # 이후 RPM 감소 구간에 따른 음성 출력
        if rpm_reached_5000:
                if rpm_value < 4500 and rpm_value >= 3500:
                    print("2번케이스", rpm_value, prev_rpm)
                    sounds = [nobrake_1_sound, nobrake_2_sound, nobrake_3_sound]
                    threading.Thread(target=play_sounds_in_sequence, args=(sounds,), daemon=True).start()
                elif rpm_value < 3500 and rpm_value >= 2500:
                    print("3번케이스", rpm_value, prev_rpm)
                    sounds = [speedless_1_sound, speedless_2_sound]
                    threading.Thread(target=play_sounds_in_sequence, args=(sounds,), daemon=True).start()
                elif rpm_value < 2500 and rpm_value >= 1500:
                    print("4번케이스", rpm_value, prev_rpm)
                    sounds = [carstop_1_sound, carstop_2_sound]
                    threading.Thread(target=play_sounds_in_sequence, args=(sounds,), daemon=True).start()
                    rpm_reached_5000 = False
                    
                prev_rpm = rpm_value

    # Rapid Acceleration
    elif accel_value > 1000 and brake_value <= 30:
        state = "Rapid Acceleration"
        update_display_state(accel_value, brake_value, state)
        mqtt_state = 1
        elapsed_time = current_time - last_sound_time[state]
        if (state != last_played_state) and elapsed_time >= state_hold_time and elapsed_time >= sound_delay:
            stop_sounds = False
            sounds = [accelaccel_sound]
            threading.Thread(target=play_sounds_in_sequence, args=(sounds,), daemon=True).start()
            last_sound_time[state] = current_time
            last_played_state = state  # 마지막 재생 상태 갱신

    # Rapid Braking
    elif brake_value > 200 and accel_value <= 30:
        state = "Rapid Braking"
        update_display_state(accel_value, brake_value, state)
        mqtt_state = 2
        elapsed_time = current_time - last_sound_time[state]
        if (state != last_played_state) and elapsed_time >= state_hold_time and elapsed_time >= sound_delay:
            stop_sounds = False
            sounds = [brakebrake_sound]
            threading.Thread(target=play_sounds_in_sequence, args=(sounds,), daemon=True).start()
            last_sound_time[state] = current_time
            last_played_state = state

    # Both Feet Driving
    elif accel_value > 100 and brake_value > 100:
        state = "Both Feet Driving"
        update_display_state(accel_value, brake_value, state)
        mqtt_state = 3
        elapsed_time = current_time - last_sound_time[state]
        if (state != last_played_state) and elapsed_time >= state_hold_time and elapsed_time >= sound_delay:
            stop_sounds = False
            sounds = [bothdrive_sound]
            threading.Thread(target=play_sounds_in_sequence, args=(sounds,), daemon=True).start()
            last_sound_time[state] = current_time
            last_played_state = state

    # 상태가 Normal로 돌아왔을 때
    else:
        state = "Normal Driving"
        update_display_state(accel_value, brake_value, state)
        is_accelerating = False
        stop_sounds = True  # 조건에 맞지 않으면 음성 중단
        last_played_state = None  # 정상 상태로 돌아오면 마지막 재생 상태 초기화

    data["driveState"] = state
        
    # 상태가 변경되고 mqtt_state가 None이 아    닐 때만 MQTT 전송    
    if mqtt_state is not None and mqtt_state != prev_mqtt_state:
        alert_data = {
            "carId": "01가1234",
            "state": mqtt_state
        }
        print(alert_data)
        client.publish('AbnormalDriving', json.dumps(alert_data), 0, retain=False)
        #이전 상태  갱신
        prev_mqtt_state = mqtt_state

# 초기 값 설정
previous_speed = 0  # 이전 속도 (km/h)
previous_time = time.time()

#1초마다 KM/H계산 툴
def delta_speed(current_speed):
    global previous_speed, previous_time

    current_time = time.time()
    kmh = current_speed - previous_speed  # 속도 변화 (km/h)
    
    # 이전 속도와 시간 업데이트
    previous_speed = current_speed
    previous_time = current_time

    return kmh


# 데이터 수집 및 업데이트 함수
def run_code():
    i = 0
    while i < len(df):  # 데이터프레임의 길이에 따라 반복
        try:
            # 첫 번째 로드셀 (엑셀)
            val_accelerator = hx1.get_weight(5)
            print(f"현재상태 : 액셀(Accelerator)  무게: {val_accelerator} g")

            # 두 번째 로드셀 (브레이크)
            val_brake = hx2.get_weight(5)
            print(f"현재상태 : 브레이크(Brake) 무게: {val_brake} g")
            
            update_display_state(val_accelerator, val_brake)
            hx1.power_down()
            hx2.power_down()
            hx1.power_up()
            hx2.power_up()
            
            rpm_value = df.iloc[i]['Engine RPM']  # Engine RPM 칼럼 값
            speed_value = df.iloc[i]['Ground Speed']  # Ground Speed 칼럼 값
            if pd.isna(speed_value):
                speed_value = 0  # 기본값 설정

            print("rpm : ", rpm_value, "speed : ", speed_value)
            
            # 현재 시간 추가
            now = datetime.now()
            data.update({
                "carId": "01가1234",  # 차량 ID 유지
                "aclPedal": int(val_accelerator),
                "brkPedal": int(val_brake),
                "createDate": now.strftime('%Y-%m-%dT%H:%M:%S'),
                "driveState": data.get("driveState", ""),  # 기존 driveState 유지
                "speed": int(speed_value),
                "rpm": int(rpm_value),
                "speedChange": 20.0  # speedChange data["kmh"]
            })             
            print(data)
            # 레이블 업데이트 (정수 형식)
            text_label.config(text=f"현재 : {int(speed_value)}")    
            
            client.publish('pedal', json.dumps(data), 0, retain=False)
            i += 1
            time.sleep(1)

        except Exception as error:
            print(error)
            continue

# 쓰레드로 run_code 실행
threading.Thread(target=run_code, daemon=True).start()

# Tkinter 메인 루프 시작
root.mainloop()
