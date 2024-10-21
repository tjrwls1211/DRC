// 서버로 회원가입, 로그인 요청 통신 코드
import axios from 'axios';
import {API_KEY} from "@env";
// C:\DRC\drc-app\babel.config.js 파일에서 모듈네임을 @env로 설정했기 때문에 @env에서 불러온다
// 모듈네임 설정 않은 경우 - import { API_KEY } from 'react-native-dotenv;

// 공통 URL 설정
// apiClient 인스턴스 생성 - baseURL, headers 같은 공통된 설정 정의하여 API 호출에 사용
const apiClient = axios.create({
  baswURL: "", // 서버 기본 URL
  headers: {
    "Content-Type": "application/json",
  }
});


// 서버로 로그인 데이터 전송
export const loginUser = async (email, password) => {
  const data = {
    id: email,
    pw: password
  };

  try {
    const response = await apiClient.post('/exam-url', data);
    console.log('로그인 데이터 전송 성공:', response.data);
    return response.data.success; // 서버 반환 성공 여부
  } catch (error) {
      console.error('로그인 데이터 전송 오류:', error);
      throw error; // 오류 발생 시 상위에서 처리
  }
};

// 회원가입 ID 중복 확인
export const checkID = async (email) => {
  try {
    const response = await apiClient.post('/exam-url', {email});
    return response.data.isDuplicate; // 서버에서 boolean(?)값 반환
  } catch (error) {
    console.error('ID 중복 확인 오류:', error);
    throw error;
  }
}

// 회원가입 가입 요청
export const SignUpUser = async (email, password, nickname, birthDate) => { //nickname, birthDate 수정 필요
  const data = {
    id: email,
    pw: password,
    nickname: nickname,
    birthDate: birthDate
  }

  try {
    const response = await apiClient.post('/exam-url', data);
    console.log('회원가입 데이터 전송 성공:', response.data);
    return response.data.success; // 서버 반환 성공 여부
  } catch (error) {
      console.error('회원가입 데이터 전송 오류:', error);
      throw error;
  }
};