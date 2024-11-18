import serial
import time

# ELM327 연결 초기화
def initialize_obd():
    try:
        obd = serial.Serial(
            port='/dev/rfcomm0',  # Bluetooth 포트 (필요 시 수정)
            baudrate=9600,       # 기본 속도
            timeout=1            # 1초 대기
        )
        print("ELM327 연결 성공!")
        return obd
    except Exception as e:
        print(f"ELM327 연결 실패: {e}")
        return None

# 명령 전송 및 응답 읽기
def send_and_receive(obd, command):
    try:
        obd.write((command + '\r').encode('utf-8'))  # 명령 전송
        time.sleep(0.2)  # 응답 대기
        response = obd.read(1024).decode('latin1').strip()  # 응답 읽기
        return response if response else "응답 없음"
    except Exception as e:
        return f"명령 전송 실패: {e}"

# 속도 및 RPM 출력
def run():
    obd = initialize_obd()
    if not obd:
        return

    try:
        # 차량이 지원하는 PID 확인
        pid_response = send_and_receive(obd, "0100")
        print(f"PID 지원 목록: {pid_response}")

        while True:
            # 속도 요청
            speed_response = send_and_receive(obd, "010D")
            print(f"속도 응답: {speed_response}")
            
            # RPM 요청
            rpm_response = send_and_receive(obd, "010C")
            print(f"RPM 응답: {rpm_response}")

            time.sleep(1)  # 1초 간격
    except KeyboardInterrupt:
        print("프로그램 종료")
        obd.close()
    except Exception as e:
        print(f"오류 발생: {e}")
        obd.close()

if __name__ == "__main__":
    run()
