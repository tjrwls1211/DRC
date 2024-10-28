// 인증 관련 API 파일 (회원가입, 로그인 요청 통신 등)
import axios from 'axios';
import { API_URL } from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage';
// C:\DRC\drc-app\babel.config.js 파일에서 모듈네임을 @env로 설정했기 때문에 @env에서 불러온다
// 모듈네임 설정 않은 경우 - import { API_KEY } from 'react-native-dotenv;

console.log("env 테스트/API_URL: ", API_URL);

// 공통 URL 설정
// apiClient 인스턴스 생성 - baseURL, headers 같은 공통된 설정 정의하여 API 호출에 사용
const apiClient = axios.create({
  baseURL: API_URL, // 서버 기본 URL
  headers: {
    "Content-Type": "application/json", // JSON 형식의 데이터를 보내기 위해 Content-Type을 application/json으로 설정
  }
});

// 서버로 로그인 데이터 전송
export const loginUser = async (email, password) => {
  const data = {
    id: email,
    pw: password
  };

  console.log("로그인 데이터:", data);

  try {
    const response = await apiClient.post("/api/user/login", data);
    console.log('로그인 데이터 전송 성공:', response.data);
    console.log('반환response: ', response);
    
    // 로그인 성공 시 JWT 토큰 저장
    const token = response.data;
    await AsyncStorage.setItem('token',  token);
    console.log("로컬 저장 토큰:", token);

    return response.data; // 서버 반환 성공 여부
  } catch (error) {
    if (error.response) {
      console.error('로그인 실패 이유:', error.response.data);
   } else {
        console.error('로그인 데이터 전송 오류:', error);
    }
    throw error; 
    }
};

// 서버로 JWT 유효성 검사 요청 통신 코드
export const checkTokenValidity = async (token) => {
  try {
    const response = await apiClient.post("/api/user/checkToken", { token });
    return response.data.isValid; // JWT 유효성 여부 반환
  } catch (error) {
    console.error('JWT 유효성 검사 오류:', error);
    return false; // 오류 발생 시 false 반환
  }
};


// 회원가입 ID 중복 확인
export const checkID = async (email) => {

  console.log(data);

  try {
    const response = await apiClient.get("/api/user/check", { params: { id: email }});
    console.log(response.data);
    return response.data; // 서버에서 boolean(?)값 반환
  } catch (error) {
    console.error('ID 중복 확인 오류:', error);
    throw error;
  }
};

// 회원가입 가입 요청
export const SignUpUser = async (email, password, nickname, birthDate, carNumber) => { //carnum을 carId로 넘겨줌
  const data = {
    id: email,
    pw: password,
    nickname: nickname,
    birthDate: birthDate,
    carId: carNumber,
  }

  console.log("회원가입 데이터: ", data);

  try {
    const response = await apiClient.post("/api/user/signUp", data);
    console.log("회원가입 반환 데이터: ", response);
    console.log('회원가입 데이터 전송 성공:', response.data.success);
    console.log('회원가입 실패 이유: ', response.data.message);
    return response.data; // 서버 반환 성공 여부
  } catch (error) {
      console.error('회원가입 데이터 전송 오류:', error);
      throw error;
  }
};

// 2차 인증 활성화 요청
export const enableTwoFactorAuth = async () => {
  try {
    // 서버에 2차 인증 활성화 요청
    const response = await apiClient.post("/api/2fa/enable");
    const qrUrl = response.data.qrUrl; // 응답에서 OR 코드 URL 추출
    // QR URL을 사용자에게 전달하여 설정할 수 있도록 처리
    return qrUrl;
  } catch (error) {
    console.error("2차 인증 활성화 오류:", error);
    throw error;
  }
};

// 2차 인증 비활성화 요청
export const disableTwoFactorAuth = async () => {
  try {
    // 서버에 2차 인증 비활성화 요청
    await apiClient.post("/api/2fa/disable");
  } catch (error) {
    console.error("2차 인증 비활성화 오류:", error);
    throw error;
  }
};

// OTP 검증 요청
export const checkOTP = async (email, otp) => {
  try {
    // 서버에 OTP 검증 요청 (이메일, OTP코드 전송)
    const response = await apiClient.post("/api/2fa/check", { email, otp });
    return response.data.success; // 검증 성공 여부 반환
  } catch (error) {
    console.error("OTP 인증 실패:", error);
    throw error;
  }
};