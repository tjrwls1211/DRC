import obd

try:
    # OBD-II 연결
    connection = obd.OBD("/dev/rfcomm0")
    
    if connection.is_connected():
        print("OBD-II 연결 성공!")
    else:
        print("OBD-II 연결 실패!")
        exit()

    # 속도 데이터 요청
    cmd = obd.commands.SPEED
    response = connection.query(cmd)

    if response.value:
        print(f"속도: {response.value} km/h")
    else:
        print("속도 데이터를 가져올 수 없습니다.")

except Exception as e:
    print(f"에러 발생: {e}")

finally:
    # 포트 닫기
    if 'connection' in locals() and connection.is_connected():
        connection.close()
        print("포트를 닫았습니다.")
