import serial
import time

# 블루투스 연결 설정 (포트와 baudrate 확인)
def connect_obd():
    try:
        obd = serial.Serial(
            port='/dev/rfcomm0',  # 이미 연결된 Bluetooth 포트 (확인 필요)
            baudrate=9600,       # 기본 속도
            timeout=1            # 1초 대기
        )
        print("OBD-II 연결 성공!")
        return obd
    except Exception as e:
        print(f"OBD-II 연결 실패: {e}")
        return None

# 명령 전송 및 응답 받기
def send_command(obd, command):
    try:
        obd.write((command + '\r').encode('utf-8'))  # 명령 전송
        time.sleep(0.1)  # 응답 대기
        response = obd.read(1024).decode('latin1').strip()  # 응답 읽기
        return response
    except Exception as e:
        print(f"명령 전송 실패: {e}")
        return None

# 속도 및 RPM 데이터 읽기
def run():
    obd = connect_obd()
    if not obd:
        return  # 연결 실패 시 종료

    try:
        while True:
            # 속도 요청
            speed_response = send_command(obd, "010D")  # 속도 명령
            if speed_response:
                print(f"속도 원시 응답: {speed_response}")
                # 데이터 파싱
                try:
                    speed_hex = speed_response.split()[-1]
                    speed = int(speed_hex, 16)  # 16진수를 10진수로 변환
                    print(f"속도: {speed} km/h")
                except:
                    print("속도 데이터를 파싱할 수 없습니다.")

            # RPM 요청
            rpm_response = send_command(obd, "010C")  # RPM 명령
            if rpm_response:
                print(f"RPM 원시 응답: {rpm_response}")
                # 데이터 파싱
                try:
                    rpm_hex = rpm_response.split()[-2:]  # 두 바이트 데이터
                    rpm = (int(rpm_hex[0], 16) * 256 + int(rpm_hex[1], 16)) // 4
                    print(f"RPM: {rpm} rpm")
                except:
                    print("RPM 데이터를 파싱할 수 없습니다.")

            time.sleep(1)  # 1초 간격
    except KeyboardInterrupt:
        print("\n프로그램 종료")
    finally:
        obd.close()

if __name__ == "__main__":
    run()
