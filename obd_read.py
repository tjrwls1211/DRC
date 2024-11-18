import obd

def run():
    # 연결 설정 (자동 탐색)
    connection = obd.OBD()  # 연결된 Bluetooth 장치를 자동 검색
    if not connection.isconnected():
        print("OBD-II 연결 실패")
        return

    print("OBD-II 연결 성공")

    while True:
        try:
            # 속도 데이터 요청
            cmdspeed = obd.commands.SPEED  # 미리 정의된 명령어
            responsespeed = connection.query(cmdspeed)
            if response_speed.value:
                print(f"속도: {response_speed.value.to('km/h')}")

            # RPM 데이터 요청
            cmd_rpm = obd.commands.RPM
            response_rpm = connection.query(cmd_rpm)
            if response_rpm.value:
                print(f"RPM: {response_rpm.value}")

        except KeyboardInterrupt:
            print("\n프로그램 종료")
            break

if __name == "__main":
    run()