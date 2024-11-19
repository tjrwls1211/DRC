import obd

# OBD-II 연결 설정
ports = obd.scan_serial()  # 사용 가능한 포트 스캔
print(f"사용 가능한 포트: {ports}")

if not ports:
    print("OBD-II 포트를 찾을 수 없습니다!")
    exit()

# 수동으로 포트를 지정하여 연결 ("/dev/rfcomm0"를 실제 포트로 변경)
connection = obd.OBD("/dev/rfcomm0")

# 연결 상태 확인 코드
if connection.is_connected():
    print("OBD-II 연결 성공!")
else:
    print("OBD-II 연결 실패!")
    exit()

# 속도 데이터 요청
cmd = obd.commands.SPEED

# 응답 받기
response = connection.query(cmd)

# 응답 데이터 출력
if response.value:
    print(f"속도: {response.value} km/h")
    print(f"속도: {response.value.to('mph')} mph")
else:
    print("속도 데이터를 가져올 수 없습니다.")
