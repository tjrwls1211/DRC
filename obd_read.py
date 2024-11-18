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
        # ELM327 초기화 명령
        obd.write(b'ATZ\r')  # 장치 리셋
        time.sleep(1)
        obd.write(b'ATE0\r')  # 에코 끄기
        time.sleep(1)
        print("ELM327 연결 및 초기화 성공!")
        return obd
    except Exception as e:
        print(f"ELM327 연결 실패: {e}")
        return None

# 명령 전송 및 응답 읽기
def send_and_receive(obd, command):
    try:
        obd.write((command + '\r').encode('utf-8'))  # 명령 전송
        time.sleep(0.1)  # 응답 대기
        response = obd.read(1024).decode('latin1').strip()  # 응답 읽기
        if response:
            return response
        else:
            return "응답 없음"
    except Exception as e:
        return f"명령 전송 실패: {e}"

# 데이터 파싱
def parse_data(response):
    try:
        lines = response.splitlines()
        if not lines:
            return None
        # 마지막 줄의 마지막 값을 16진수로 변환
        hex_data = lines[-1].split()[-1]
        return int(hex_data, 16)
    except Exception:
        return None

# 속도 및 RPM 데이터 수집
def run():
    obd = initialize_obd()
    if not obd:
        return

    try:
        while True:
            # 속도 요청
            speed_response = send_and_receive(obd, "010D")
            print(f"속도 원시 응답: {speed_response}")  # 디버깅 출력
            speed = parse_data(speed_response)
            if speed is not None:
                print(f"속도: {speed} km/h")
            else:
                print("속도 데이터를 가져올 수 없습니다.")

            # RPM 요청
            rpm_response = send_and_receive(obd, "010C")
            print(f"RPM 원시 응답: {rpm_response}")  # 디버깅 출력
            rpm = parse_data(rpm_response)
            if rpm is not None:
                print(f"RPM: {rpm} rpm")
            else:
                print("RPM 데이터를 가져올 수 없습니다.")

            time.sleep(1)  # 1초 대기
    except KeyboardInterrupt:
        print("프로그램 종료")
        obd.close()
    except Exception as e:
        print(f"오류 발생: {e}")
        obd.close()

if __name__ == "__main__":
    run()
