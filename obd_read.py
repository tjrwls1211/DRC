import obd  # python-OBD 라이브러리

try:
    # OBD-II 포트 연결 (ISO 15765-4 CAN 프로토콜 사용)
    connection = obd.OBD("/dev/rfcomm0", protocol="6")  # "6"은 CAN 프로토콜

    # 연결 상태 확인
    if connection.is_connected():
        print("OBD-II 연결 성공!")
    else:
        print("OBD-II 연결 실패!")
        exit()

    # 지원되는 명령어 목록 출력 (선택 사항)
    print("지원되는 명령어:")
    print(connection.supported_commands)

    # 속도 데이터 요청
    cmd = obd.commands.SPEED  # 차량 속도 요청 명령
    response = connection.query(cmd)

    # 데이터 출력
    if response.value:
        print(f"속도: {response.value} km/h")
        print(f"속도: {response.value.to('mph')} mph")
    else:
        print("속도 데이터를 가져올 수 없습니다.")

except Exception as e:
    print(f"에러 발생: {e}")

finally:
    # 포트 닫기
    if 'connection' in locals() and connection.is_connected():
        connection.close()
        print("포트를 닫았습니다.")
