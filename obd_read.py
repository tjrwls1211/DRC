import serial
import time

# ELM327 연결 초기화
def initialize_obd():
    try:
        obd = serial.Serial(
            port='/dev/rfcomm0',  # Bluetooth 포트
            baudrate=9600,       # 기본 속도
            timeout=1            # 1초 대기
        )
        obd.write(b'ATZ\r')  # 초기화 명령 (리셋)
        time.sleep(1)
        obd.write(b'ATE0\r')  # 에코 끄기
        time.sleep(1)
        print("ELM327 연결 및 초기화 성공")
        return obd
    except Exception as e:
        print(f"ELM327 초기화 실패: {e}")
        return None

# 명령 전송 및 응답 읽기
def send_and_receive(obd, command):
    try:
        obd.write((command + '\r').encode('utf-8'))  # 명령 전송
        time.sleep(0.1)  # 응답 대기
        response = obd.read(1024).decode('latin1').strip()  # 응답 읽기
        return response
    except Exception as e:
        print(f"명령 전송 또는 응답 실패: {e}")
        return ""

# 데이터 추출
def extract_data(response):
    try:
        lines = response.splitlines()
        if not lines:
            return None
        hex_data = lines[-1].split()[-1]  # 마지막 줄에서 데이터 추출
        return int(hex_data, 16)         # 16진수를 정수로 변환
    except Exception:
        return None

# 속도 및 RPM 출력
def run():
    obd = initialize_obd()
    if not obd:
        return

    try:
        while True:
            # 속도 요청
            speed_response = send_and_receive(obd, "010D")
            speed = extract_data(speed_response)
            if speed is not None:
                print(f"속도: {speed} km/h")
            else:
                print("속도 데이터를 가져올 수 없습니다.")

            # RPM 요청
            rpm_response = send_and_receive(obd, "010C")
            rpm = extract_data(rpm_response)
            if rpm is not None:
                print(f"RPM: {rpm} rpm")
            else:
                print("RPM 데이터를 가져올 수 없습니다.")

            time.sleep(1)  # 1초 간격
    except KeyboardInterrupt:
        print("프로그램 종료")
        obd.close()
    except Exception as e:
        print(f"오류 발생: {e}")
        obd.close()

if __name__ == "__main__":
    run()
