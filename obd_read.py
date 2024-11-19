import obd

# 수동 포트 설정
connection = obd.OBD("/dev/rfcomm0")  # /dev/rfcomm0는 실제 포트를 사용해야 함

# 연결 상태 확인
if connection.is_connected():
    print("OBD-II 연결 성공!")
else:
    print("OBD-II 연결 실패!")
    exit()

# 속도 데이터 요청
cmd = obd.commands.SPEED
response = connection.query(cmd)

# 결과 출력
if response.value:
    print(f"속도: {response.value} km/h")
else:
    print("속도 데이터를 가져올 수 없습니다.")
