# DRC (Don't Rush the Car)

<p align="center">
  <img src="https://github.com/user-attachments/assets/8150a1ff-b04e-4dfa-b45d-0bdf1df7c4b8" alt="drc" width="500"/>
</p>

운전자 페달 오조작 방지를 위한 실시간 감지 및 피드백 시스템  
> Raspberry Pi 기반 주행 행동 분석 솔루션

---

## 📌 프로젝트 개요

**DRC**는 운전 중 현재 밟고 있는 페달을 운전자에게 명확히 인지시켜  
페달 오조작을 방지하고 급발진 상황에 실시간으로 대응할 수 있도록 지원하는 프로젝트입니다.  

또한, 주행 중 수집한 센서 데이터를 기반으로 **운전 습관을 분석하고 개인 맞춤형 피드백을 제공하는 시스템**입니다.

---

## 📊 데이터 흐름도 (DFD)

<p align="center">
  <img src="https://github.com/user-attachments/assets/618ff47c-7e4f-4131-8073-327cc2b77592" alt="DFD" width="700"/>
</p>

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

---

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

## 🧪 감지 기준 및 점수 산정 방식

**감지 기준**  
아래 표와 같이 속도 구간별 가속/감속 변화량을 기준으로 이상 운전을 감지합니다.

**감지 기준 & 점수 산정 방식**

<p align="center">
  <img src="https://github.com/user-attachments/assets/53319d4c-7f04-4b42-a769-51d0c861a5e1" alt="criteria" width="400"/>
  <img src="https://github.com/user-attachments/assets/420906ae-9392-4ade-9e74-b239e07eb196" alt="scoring" width="400"/>
</p>

---

## 🚘 실제 운행 모습 및 결과

**실제 운행 화면 & DB 저장 화면**

<p align="center">
  <img src="https://github.com/user-attachments/assets/1e0c816e-69cf-45d6-be59-69a12e9cb2d7" alt="driving" width="400"/>
  <img src="https://github.com/user-attachments/assets/06b5dfc5-96c8-46c1-8cf9-b0523b30621d" alt="db" width="400"/>
</p>

**앱 내에서 점수 및 습관 확인 가능**

<p align="center">
  <img src="https://github.com/user-attachments/assets/56c87812-607f-4ac6-a9c4-84bfe7988c5f" alt="app1" width="400"/>
  <img src="https://github.com/user-attachments/assets/4f56473c-e72e-4073-8ddb-a41d9536b89f" alt="app2" width="400"/>
</p>

---

## 📂 디렉토리 구조

```
DRC/
├── backend/         # Spring Boot 서버
├── frontend/        # React Native 앱
├── raspberrypi/       # 센서 데이터 수집 및 송신 코드
├── README.md
```

---

## 📄 라이선스

이 프로젝트는 [MIT 라이선스](./LICENSE)를 따릅니다.

---

## 📬 문의

- 담당자: [이석진](mailto:seokjin6635@gmail.com)
