import obd
from obd import OBDStatus

# OBD-II 연결 부분
connection = obd.OBD()

# 연결 상태 확인 및 디버깅
if connection.status == OBDStatus.NOT_CONNECTED:
    print("OBD-II 어댑터가 연결되지 않음")
elif connection.status == OBDStatus.ELM_CONNECTED:
    print("OBD-II 어댑터와 연결되었지만 차량이 감지되지 않음")
elif connection.status == OBDStatus.OBD_CONNECTED:
    print("차량이 연결되었지만 점화 상태를 확인 불가")
elif connection.status == OBDStatus.CAR_CONNECTED:
    print("차량이 연결되었고, 점화 상태도 확인 데이터 수집 가능")
else:
    print("알 수 없는 상태입니다.")

# 속도 데이터
if connection.status == OBDStatus.CAR_CONNECTED:  # 차량이 제대로 연결된 경우만 실행
    cmd = obd.commands.SPEED
    response = connection.query(cmd)
    
    if response.value:  # 데이터가 유효한 경우
        print(f"속도: {response.value} km/h")
        print(f"속도: {response.value.to('mph')} mph")
    else:
        print("속도 데이터를 가져올 수 없음")
else:
    print("OBD-II 연결이 완료되지 않아 데이터를 요청할 수 없음")
