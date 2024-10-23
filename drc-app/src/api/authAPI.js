// 서버로 회원가입, 로그인 요청 통신 코드
import axios from 'axios';
import {API_KEY} from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage';
// C:\DRC\drc-app\babel.config.js 파일에서 모듈네임을 @env로 설정했기 때문에 @env에서 불러온다
// 모듈네임 설정 않은 경우 - import { API_KEY } from 'react-native-dotenv;

// 공통 URL 설정
// apiClient 인스턴스 생성 - baseURL, headers 같은 공통된 설정 정의하여 API 호출에 사용
const apiClient = axios.create({
  baseURL: API_KEY, // 서버 기본 URL
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
    const response = await axios.post("http://비밀/api/user/login", data);
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

// // (수정 예정) JWT 토큰 유효성 검사
// export const checkTokenValidity  = async () => {
//   try {
//     const token = await AsyncStorage.getItem('token'); // 저장된 토큰 가져오기
//     if (!token) return false;

//     // 토큰 존재 시, 토큰 유효 확인 - 서버에 get 요청 보냄
//     // ? Authorization 헤더에 Bearer ${token} 형식으로 토큰 포함 - 이 방식은 서버가 클라이언트 인증 확인 할 수 있도록 함
//     const response = await axios.get("http://비밀/api/pedalLog/sel/CAR789", {headers: {Authorization: `Bearer ${token}`}
//     });
//     return response.data;
//   } catch (error) {
//     console.log("토큰 유효성 검사 오류", error);
//     return false;
//   }
// }

// 회원가입 ID 중복 확인
export const checkID = async (email) => {

  console.log(data);

  try {
    const response = await axios.get("http://비밀/api/user/check", { params: { id: email }});
    console.log(response.data);
    return response.data; // 서버에서 boolean(?)값 반환
  } catch (error) {
    console.error('ID 중복 확인 오류:', error);
    throw error;
  }
}

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
    const response = await axios.post("http://비밀/api/user/signUp", data);
    console.log("회원가입 반환 데이터: ", response);
    console.log('회원가입 데이터 전송 성공:', response.data.success);
    console.log('회원가입 실패 이유: ', response.data.message);
    return response.data; // 서버 반환 성공 여부
  } catch (error) {
      console.error('회원가입 데이터 전송 오류:', error);
      throw error;
  }
};