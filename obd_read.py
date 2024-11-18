import obd

def run():
    # Bluetooth 포트 지정
    # Bluetooth 연결 포트를 지정 (예: 'rfcomm0')
    connection = obd.OBD(port="/dev/rfcomm0")  # 포트를 지정해 연결
    if not connection.is_connected():
        print("OBD-II 연결 실패")
        return

    print("OBD-II 연결 성공!")

    while True:
        try:
            # 속도 데이터 요청
            cmd_speed = obd.commands.SPEED  # 미리 정의된 속도 명령
            response_speed = connection.query(cmd_speed)
            if response_speed.value:
                print(f"속도: {response_speed.value} km/h")

            # RPM 데이터 요청
            cmd_rpm = obd.commands.RPM
            response_rpm = connection.query(cmd_rpm)
            if response_rpm.value:
                print(f"RPM: {response_rpm.value} rpm")

        except KeyboardInterrupt:
            print("\n프로그램 종료")
            break

if __name__ == "__main__":
    run()
