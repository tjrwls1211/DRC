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
    const response = await apiClient.post("/user/login", data);
    console.log('로그인 데이터 전송 성공:', response.data);
    
    // 로그인 성공 시 JWT 토큰 저장
    const token = response.data.token;
    
    // 토큰이 존재할 경우만 저장
    if (token) {
      await AsyncStorage.setItem('token', token);
      console.log("로컬 저장 토큰:", token);
    } else {
      console.log("토큰이 없으므로 저장하지 않습니다.");
    }

    return response.data; // 서버 반환 성공 여부
  } catch (error) {
    if (error.response) {
      console.error('로그인 실패 이유:', error.response.data);
    } else {
      console.error('로그인 데이터 전송 오류:', error);
    }
    throw error; 
  }
//   if (error.response) {
//     const errorData = error.response.data;

//     // 에러 메시지를 파싱하여 사용자에게 적절한 메시지 전달
//     let userFriendlyMessage = '로그인 실패:';

//     // 비밀번호 관련 에러 메시지 추가
//     if (errorData.includes("비밀번호는 최소 8자")) {
//         userFriendlyMessage += ' 비밀번호는 최소 8자, 하나의 문자, 숫자, 특수 문자가 포함되어야 합니다.';
//     }

//     // 이메일 관련 에러 메시지 추가
//     if (errorData.includes("올바른 이메일 형식이 아닙니다")) {
//         userFriendlyMessage += ' 유효한 이메일 주소를 입력하세요.';
//     }

//     console.error('로그인 실패 이유:', errorData);
//     alert(userFriendlyMessage); // 사용자에게 알림
// } else {
//     console.error('로그인 데이터 전송 오류:', error);
//     alert('로그인 처리 중 네트워크 오류가 발생했습니다.');
// }
// throw error; 
// }

};


// 서버로 JWT 유효성 검사 요청 통신 코드
export const checkTokenValidity = async (token) => {
  try {
    const response = await apiClient.get("/user/validate", {
      headers: {
        'Authorization': `Bearer ${token}` // 헤더에 토큰 추가
      }
    });
    return response.data; // 응답 데이터 전체 반환
  } catch (error) {
    if (error.response) {
      console.log('서버에서 반환된 오류 메시지:', error.response); // 오류 메시지 출력
    } else {
      console.error('JWT 유효성 검사 오류:', error);
    }
    return { valid: false }; // 오류 발생 시 false 반환
  }
};



// 회원가입 ID 중복 확인
export const checkID = async (email) => {
  try {
    const response = await apiClient.get("/user/check", { params: { id: email }});
    console.log("ID중복 여부: ", response.data);
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
    const response = await apiClient.post("/user/signUp", data);
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
    // 로컬 스토리지에서 토큰 가져오기
    const token = await AsyncStorage.getItem('token');
    console.log(token);
    
    // 서버에 2차 인증 활성화 요청
    const response = await apiClient.post("/user/otp", null, {
      headers: {
        Authorization: `Bearer ${token}`, // JWT 토큰을 Authorization 헤더에 추가
      },
    });
    
    console.log("2차인증 반환 데이터: ", response.data);
    const qrUrl = response.data.qrurl; // 응답에서 OR 코드 URL 추출
    const otpKey = response.data.otpKey;
    console.log("OTP QR_URL: ", qrUrl);
    console.log("OTP Key: ", otpKey);
    // QR URL을 사용자에게 전달하여 설정할 수 있도록 처리
    return { qrUrl, otpKey };
  } catch (error) {
    console.error("2차 인증 활성화 오류:", error);
    throw error;
  }
};

// 2차 인증 비활성화 요청 - TODO: 백엔드 개발 후 그에 맞게 수정
export const disableTwoFactorAuth = async () => {
  try {
    console.log("2차인증 비활성 함수 들어옴");
    const token = await AsyncStorage.getItem('token');

    const response = await apiClient.post("/user/disableMfa", {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log("2차인증 비활성화 반환 데이터: ", response.data);
    
    return response.data; // 성공 여부와 메시지 반환
  } catch (error) {
    console.error("2차 인증 비활성화 오류(API 함수):", error.response ? error.response.data : error.message);
    throw error;
  }
};


// OTP 검증 요청
export const checkOTP = async (email, otp) => {
  const data = {
    id: email,
    key: otp
  };

  console.log("2차 인증 검증 요청값: ", data);

  try {
    // 서버에 OTP 검증 요청 (이메일, OTP코드 전송)
    const response = await apiClient.post("/user/mfa", data);

    console.log("otp 검증 요청 반환 데이터: ", response.data);
    
    // 2차 인증 성공 시 JWT 토큰이 포함된 경우 저장
    if (response.data.success) {
      await AsyncStorage.setItem('token', response.data.token); // 새로 발급된 토큰 저장
      console.log("2차인증 후 토큰 저장: ", response.data.token);
    }

    return response.data.success; // 검증 성공 여부 반환
  } catch (error) {
    if (error.response) {
      console.error("OTP 인증 실패@:", error.response.data); // 서버 응답 데이터 출력
      console.error("HTTP 상태 코드@:", error.response.status); // HTTP 상태 코드 출력
    } else {
      console.error("OTP 인증 요청 오류@:", error);
    }
    throw error;
  }
};

