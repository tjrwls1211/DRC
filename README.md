# 🚗 DRC (Don't Rush the Car)

<p align="center">
  <img src="https://github.com/user-attachments/assets/8150a1ff-b04e-4dfa-b45d-0bdf1df7c4b8" alt="drc" width="500"/>
</p>

차량 운전 습관 분석 및 이상 운전 감지 시스템  
> Raspberry Pi 기반 실시간 운전 감지 프로젝트

---

## 📌 프로젝트 개요

**DRC**는 운전 중 **급가속, 급정거, 양발 운전, 급발진** 등의 **비정상 운전 패턴을 실시간으로 감지**하여 사용자에게 경고하고, 데이터를 수집/분석하여 **운전 습관 개선**을 돕는 시스템입니다.

---

## 🛠 기술 스택

| 영역 | 사용 기술 |
|------|-----------|
| 하드웨어 | Raspberry Pi, Brake/Accelerator 압력 센서, OBD 2 Scanner |
| 백엔드 | Spring Boot, JPA/Hibernate |
| DB | PostgreSQL |
| 프론트 | React Native (Expo) |
| 분석 | Python (데이터 처리, 이상 패턴 검출) |
| 기타 | GitHub Actions, TTS 음성 알림 |

## 📡 통신 프로토콜

- **MQTT**
  - Raspberry Pi에서 센서 데이터를 실시간으로 서버에 전송
  - 가속과 브레이크 페달 센서 값, 차량 속도, RPM 데이터를 초당 단위로 송신

- **CAN (via OBD-II)**
  - 차량 내부의 전자제어장치(ECU)들 간 통신을 위한 프로토콜
  - OBD-II 포트를 통해 차량 내부 CAN 네트워크에 접근
  - 다음과 같은 차량 주행 정보를 수집:
    - 속도 (PID: `010D`)
    - RPM (PID: `010C`)
    - 스로틀 위치, 브레이크 상태 등 다양한 주행 파라미터
  - 수집된 데이터는 이상 운전 감지 및 주행 분석에 활용됨

---

## 🔍 주요 기능

- **실시간 이상 운전 감지**  
  - 급가속/급제동/양발운전/급발진 판단 기준 적용
- **주행 이력 시각화 및 통계 제공**
- **위험 피드백 음성 안내 (TTS)**
- **주행 로그 기반 운전 점수 확인**

---

## 🧪 감지 기준

- **급가속**
  - 속도 6~10km/h → 초당 12km/h 이상 가속
  - 속도 10~20km/h → 초당 10km/h 이상 가속
  - 속도 20km/h 초과 → 초당 8km/h 이상 가속
- **급정거**
  - 속도 전 구간 초당 14km/h 이상 감속
- **양발 운전**
  - 브레이크, 가속 페달이 동시에 일정 수치 이상
    
---

## 🚀 프로젝트 실행 방법

```bash
추가 예정
```

---

## 📂 디렉토리 구조

```
DRC/
├── backend/         # Spring Boot 서버
├── frontend/        # React Native 앱
├── raspberryPi/       # 센서 데이터 수집 및 송신 코드
├── README.md
```

---

## 📄 라이선스

이 프로젝트는 [MIT 라이선스](./LICENSE)를 따릅니다.

---

## 📬 문의

- 담당자: [이석진](seokjin6635@gmail.com)
