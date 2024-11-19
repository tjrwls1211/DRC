import serial
import time

# UART 초기화
def initialize_uart():
    try:
        uart = serial.Serial(
            port="/dev/serial0",  # UART 포트 이름
            baudrate=9600,       # OBD-II 기본 통신 속도
            timeout=1            # 읽기 타임아웃
        )
        print("UART 연결 성공")
        return uart
    except Exception as e:
        print(f"UART 초기화 실패: {e}")
        return None

# OBD-II 명령 전송
def send_obd_command(uart, command):
    command += "\r"  # OBD-II 명령 종료 문자 (\r)
    uart.write(command.encode('utf-8'))
    time.sleep(0.1)

# OBD-II 응답 읽기
def read_obd_response(uart):
    response = uart.read(1024).decode('utf-8').strip()
    return response

# 응답 데이터 파싱
def parse_obd_data(raw_data):
    try:
        # OBD-II 데이터 포맷: "41 0D XX"에서 마지막 XX 추출
        hex_data = raw_data.split()[-1]
        return int(hex_data, 16)
    except Exception as e:
        print(f"데이터 파싱 실패: {raw_data} | 오류: {e}")
        return None

# 데이터 수집 루프
def run_code():
    uart = initialize_uart()
    if not uart:
        return

    while True:
        try:
            # 속도 요청 (PID: 010D)
            send_obd_command(uart, "010D")
            speed_raw = read_obd_response(uart)
            speed_kmh = parse_obd_data(speed_raw)
            print(f"속도: {speed_kmh} km/h" if speed_kmh is not None else "속도 데이터 없음")

            # RPM 요청 (PID: 010C)
            send_obd_command(uart, "010C")
            rpm_raw = read_obd_response(uart)
            rpm = parse_obd_data(rpm_raw)
            print(f"RPM: {rpm} rpm" if rpm is not None else "RPM 데이터 없음")

            # 1초 대기
            time.sleep(1)

        except Exception as error:
            print(f"오류 발생: {error}")
            continue

if __name__ == "__main__":
    run_code()
