import obd

def run():
    # OBD-II 연결 설정 (자동 탐색)
    connection = obd.OBD()  # 연결된 Bluetooth 장치를 자동으로 검색
    if not connection.is_connected():
        print("OBD-II 연결 실패")
        return

    print("OBD-II 연결 성공")

    while True:
        try:
            # 속도 데이터 요청
            cmd_speed = obd.commands.SPEED  # 미리 정의된 속도 명령어
            response_speed = connection.query(cmd_speed)  # 명령어 실행 및 응답 받기
            if response_speed.value:  # 유효한 값이 있는 경우
                print(f"속도: {response_speed.value} km/h")

            # RPM 데이터 요청
            cmd_rpm = obd.commands.RPM  # 미리 정의된 RPM 명령어
            response_rpm = connection.query(cmd_rpm)
            if response_rpm.value:  # 유효한 값이 있는 경우
                print(f"RPM: {response_rpm.value} rpm")

        except KeyboardInterrupt:
            print("\n프로그램 종료")
            break

if __name__ == "__main__":
    run()
