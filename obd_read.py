import serial
import time

# ELM327 Bluetooth 연결
def initialize_obd():
    try:
        # Bluetooth 포트 설정 (rfcomm0 사용)
        obd = serial.Serial(
            port='/dev/rfcomm0',  # Bluetooth 포트
            baudrate=9600,       # ELM327 기본 Baudrate
            timeout=1            # 1초 타임아웃
        )
        print("ELM327 연결 성공")
        return obd
    except Exception as e:
        print(f"ELM327 연결 실패: {e}")
        return None

# OBD 명령 전송
def send_command(obd, command):
    command += '\r'  # 명령어 끝에 '\r' 추가
    obd.write(command.encode('utf-8'))
    time.sleep(0.1)  # 응답 대기

# OBD 응답 읽기
def read_response(obd):
    response = obd.read(1024).decode('utf-8').strip()
    return response

# 데이터 파싱
def parse_data(response):
    try:
        hex_data = response.split()[-1]  # 마지막 데이터 추출
        return int(hex_data, 16)         # 16진수를 정수로 변환
    except Exception as e:
        print(f"데이터 파싱 실패: {response} | 오류: {e}")
        return None

# 속도와 RPM 데이터 수집
def run():
    obd = initialize_obd()
    if not obd:
        return

    while True:
        try:
            # 속도 데이터 요청
            send_command(obd, "010D")
            speed_response = read_response(obd)
            speed = parse_data(speed_response)
            if speed is not None:
                print(f"속도: {speed} km/h")
            else:
                print("속도 데이터 없음")

            # RPM 데이터 요청
            send_command(obd, "010C")
            rpm_response = read_response(obd)
            rpm = parse_data(rpm_response)
            if rpm is not None:
                print(f"RPM: {rpm} rpm")
            else:
                print("RPM 데이터 없음")

            # 1초 대기
            time.sleep(1)

        except Exception as e:
            print(f"오류 발생: {e}")
            continue

if __name__ == "__main__":
    run()