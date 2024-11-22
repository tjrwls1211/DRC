import obd
import time

# COM 포트 설정 및 타임아웃 증가
connection = obd.OBD("/dev/rfcomm3", fast=False)

# 연결 상태 확인
if connection.is_connected():
    print("OBD-II 연결 성공!")
else:
    print("OBD-II 연결 실패!")
    exit()

# 무한 루프 시작
while True:
    try:
        # RPM 데이터 요청
        rpm_cmd = obd.commands.RPM
        rpm_response = connection.query(rpm_cmd)

        # 속도 데이터 요청
        speed_cmd = obd.commands.SPEED
        speed_response = connection.query(speed_cmd)

        # 응답 데이터 출력
        if rpm_response.value:
            print(f"RPM: {rpm_response.value}")
        else:
            print("RPM 데이터를 가져올 수 없습니다.")

        if speed_response.value:
            print(f"속도: {speed_response.value.to('km/h')} km/h")
        else:
            print("속도 데이터를 가져올 수 없습니다.")

        time.sleep(0.5)  # 0.5초 대기

    except Exception as e:
        print(f"오류 발생: {e}")
        break
