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


# 서버 URL 설정
url = f'http://{ip()}:{port()}/data'

# 데이터 구조 정의
data = {
    "carId": "01가1234",  # 차량 ID 설정
    "aclPedal": 0,
    "brkPedal": 0,
    "createdAt": 0,
    "driveState": "",
    "speed" : 50,
    "rpm" : 2000
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
font_large = ("Arial", 40, "bold")

# 이미지 로드
accel_img_normal = ImageTk.PhotoImage(Image.open("accel_normal.png").resize((500, 400)))
accel_img_dark = ImageTk.PhotoImage(Image.open("accel_dark.png").resize((500, 400)))
brake_img_normal = ImageTk.PhotoImage(Image.open("brake_normal.png").resize((500, 400)))
brake_img_dark = ImageTk.PhotoImage(Image.open("brake_dark.png").resize((500, 400)))

# 이미지 레이블 생성
accel_label = tk.Label(root, image=accel_img_dark, bg="black")
accel_label.pack(side="right", padx=20, pady=10)

brake_label = tk.Label(root, image=brake_img_dark, bg="black")
brake_label.pack(side="left", padx=20, pady=10)

#나중에 지울꺼
data = {"driveState": "Drive Ready"}


status_label = tk.Label(root, text=data["driveState"], font=font_large, bg="black", fg="white", padx=10, pady=10, width=25)
status_label.place(relx=0.44, rely=0.05, anchor='center')

#나중에 지울꺼
#data부분을 나중에 속도 데이터로 넣으면될꺼같음 
text_label = tk.Label(root, text=f"현재 ", font=font_large, bg="black", fg="white", padx=2, pady=10, width=9)
text_label.place(relx=0.97, rely=0.05, anchor='ne')


# pygame 초기화
pygame.mixer.init()

#OBD 연결 및 데이터 요청 
#connection = obd.OBD()

#테스트 출력 확인
#print("Speed:", speed_response.value)  # km/h 단위
#print("RPM:", rpm_response.value)      # RPM 단위

# 음성 재생 시간 기록
last_accel_time = 0
is_accelerating = False

# MQTT 설정
client = mqtt.Client()
client.connect(ip(), 1222, 60)

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
    
    ##나중에 지울꺼
    #상태업데이트 : 이전 상태와 비교하여 변화가 있을 때만 업데이트 테스트 텍스트 
    if data["driveState"] != state:
        data["driveState"] = state
        status_label.config(text=data["driveState"])
    ##나중에 지울꺼
    # accel_value 레이블 업데이트 (정수 형식)
    text_label.config(text=f"현재 : {int(accel_value)}")
    #나중에 obd스피드 입력넣을때 accel_value대신에 speed_response.value 로 교체

#급발진 음성
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
                print("음성 재생 중단")
                is_playing_sounds = False  # 재생 상태 플래그 해제
                return
            time.sleep(0.1)  # 비차단 대기
        time.sleep(3)  # 음성 간 3초 간격

    is_playing_sounds = False  # 모든 음성 재생 완료 후 플래그 해제

#전역 변수로 안전 상태 저장
prev_mqtt_state = None

# 로드셀 데이터와 상태를 업데이트하는 함수    # 급발진 조건을 수정하자 accel_value < 10000 and brake_value > 5000 and speed >= 50 and rpm > 5000:
def check_info(accel_value, brake_value):
    global last_accel_time, is_accelerating, stop_sounds, is_playing_sounds, prev_mqtt_state
    mqtt_state = None
    if 200 < accel_value < 1000 and brake_value <= 30:    
        state = "Unintended Acceleration"
        update_display_state(accel_value, brake_value, state)
        #mqtt_state = 1 아직 필요없을꺼같아성 
        if not is_accelerating:
            last_accel_time = time.time()
            is_accelerating = True
        else:
            elapsed_time = time.time() - last_accel_time
            # 음성이 이미 재생 중이 아닐 때만 새로운 스레드를 시작
            if elapsed_time >= 4 and not is_playing_sounds:
                stop_sounds = True  
                time.sleep(0.2)  # 이전 스레드 종료 대기
                
                # 음성 리스트 설정
                sounds = [
                    rapidspeed_1_sound, rapidspeed_2_sound, rapidspeed_3_sound,
                    nobrake_1_sound, nobrake_2_sound, nobrake_3_sound,
                    speedless_1_sound, speedless_2_sound,
                    carstop_1_sound, carstop_2_sound
                ]

                # 새로운 스레드에서 음성 재생 시작
                threading.Thread(target=play_sounds_in_sequence, args=(sounds,), daemon=True).start()
                
                # 마지막 가속 시간 업데이트
                last_accel_time = time.time()
                             

    elif brake_value > 200 and accel_value <= 30: # 급정거 brake_value > 15000 and accel_value <= 30:
        state = "Rapid Braking" 
        update_display_state(accel_value, brake_value, state)
        mqtt_state = 2
        is_accelerating = False
        #급정거 음성
        if not is_accelerating:
            last_accel_time = time.time()
            is_accelerating = True
        else:
            elapsed_time = time.time() - last_accel_time
            if elapsed_time >= 4 and not is_playing_sounds:
                stop_sounds = True
                time.sleep(0.2)
            
                # accelaccel.wav 파일만 재생
                threading.Thread(target=play_sounds_in_sequence, args=(["brakebrake.wav"],), daemon=True).start()
                last_accel_time = time.time()         
        stop_sounds = True  # 브레이크가 작동하면 음성 재생 중단

    elif accel_value > 100 and brake_value > 100: # 양발 운전 accel_vlaue > 1000 and brake_value > 1000
        state = "Both Feet Driving"
        update_display_state(accel_value, brake_value, state)
        mqtt_state = 3
        is_accelerating = False
       
        #양발운전 음성
        if not is_accelerating:
            last_accel_time = time.time()
            is_accelerating = True
        else:
            elapsed_time = time.time() - last_accel_time
            if elapsed_time >= 4 and not is_playing_sounds:
                stop_sounds = True
                time.sleep(0.2)
            
                # accelaccel.wav 파일만 재생
                threading.Thread(target=play_sounds_in_sequence, args=(["bothdrive.wav"],), daemon=True).start()
                last_accel_time = time.time()        
        stop_sounds = True  # 양발 운전 상태에서도 음성 중단
        
    #급가속 상황    
    elif accel_value > 1000 and brake_value <= 30:
        state = "Rapid Acceleration"
        update_display_state(accel_value, brake_value, state)
        mqtt_state = 1

        if not is_accelerating:
            last_accel_time = time.time()
            is_accelerating = True
        else:
            elapsed_time = time.time() - last_accel_time
            if elapsed_time >= 4 and not is_playing_sounds:
                stop_sounds = True
                time.sleep(0.2)
            
                # accelaccel.wav 파일만 재생
                threading.Thread(target=play_sounds_in_sequence, args=(["accelaccel.wav"],), daemon=True).start()
                last_accel_time = time.time()

        is_accelerating = False
    else:
        state = "Normal Driving"
        update_display_state(accel_value, brake_value, state)
        is_accelerating = False
        stop_sounds = True  # 일반 주행일 때 음성 중단
        
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
            
            #speed_cmd = obd.commands.speed
            #rpm_cmd = obd.commands.RPM

            #데이터 요청 및 출력
            #speed_response = connection.query(speed_cmd)
            #rpm_response = connection.query(rpm_cmd)
            
            
            
            hx1.power_down()
            hx2.power_down()
            hx1.power_up()
            hx2.power_up()
                     
             # 속도 및 RPM 데이터 추가
           # if speed_response.value is not None:
                #speed_kmh = speed_response.value.to("km/h")
                #data["speed"] = float(speed_kmh)
                #text_label.config(text=f"현재 속도: {int(speed_kmh)} km/h") #이거 쓰면 될꺼같네 
            #if rpm_response.value is not None:
                #data["rpm"] = int(rpm_response.value)

            # 현재 시간 추가
            now = datetime.now()
            data.update({
                "carId": "01가1234",  # 차량 ID 유지
                "aclPedal": int(val_accelerator),
                "brkPedal": int(val_brake),
                "createdAt": datetime.now().strftime('%Y-%m-%dT%H:%M:%S'),
                "driveState": data["driveState"],  # 기존 driveState 유지
                "speed" : 40,
                "rpm" : 2000
                #delta_velocity 가속도 변수
            })            
            print(data)
            
            
            client.publish('pedal', json.dumps(data), 0, retain=False)
            #client.publish('AbnormalDriving', json.dumps(''), 0, retain=False)
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
