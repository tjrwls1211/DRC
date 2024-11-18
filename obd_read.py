import serial
import time

def connect_obd():
    try:
        # Bluetooth 포트 연결
        obd = serial.Serial(
            port='/dev/rfcomm0',  # 사용 중인 포트 확인 후 수정
            baudrate=9600,       # 기본 속도
            timeout=1            # 응답 대기 시간
        )
        # OBD-II 장치 초기화
        obd.write(b'ATZ\r')  # 리셋 명령
        time.sleep(1)
        obd.write(b'ATE0\r')  # 에코 끄기
        time.sleep(1)
        print("OBD-II 연결 성공 및 초기화 완료!")
        return obd
    except Exception as e:
        print(f"OBD-II 연결 실패: {e}")
        return None

def send_command(obd, command):
    try:
        obd.write((command + '\r').encode('utf-8'))  # 명령 전송
        time.sleep(0.2)  # 응답 대기
        response = obd.read(1024).decode('latin1').strip()  # 응답 읽기
        if response:
            return response
        else:
            return "응답 없음"
    except Exception as e:
        print(f"명령 전송 실패: {e}")
        return None

def run():
    obd = connect_obd()
    if not obd:
        return

    try:
        while True:
            # 속도 요청
            speed_response = send_command(obd, "010D")
            if speed_response:
                print(f"속도 응답: {speed_response}")
            else:
                print("속도 데이터를 가져올 수 없습니다.")

            # RPM 요청
            rpm_response = send_command(obd, "010C")
            if rpm_response:
                print(f"RPM 응답: {rpm_response}")
            else:
                print("RPM 데이터를 가져올 수 없습니다.")

            time.sleep(1)
    except KeyboardInterrupt:
        print("\n프로그램 종료")
    finally:
        obd.close()

if __name__ == "__main__":
    run()
