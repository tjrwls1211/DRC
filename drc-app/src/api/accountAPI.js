// 계정 관련 API (로그아웃, 회원탈퇴, 닉네임 수정 등)
import axios from 'axios';
import { API_URL } from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    }
  });

// 현재 닉네임 가져오기 API
export const fetchCurrentNickname = async () => {
    try {
        const token = await AsyncStorage.getItem('token'); // AsyncStorage에서 JWT 토큰 가져오기
        const response = await axios.get(`${API_URL}/api/user/nickname`, {
            headers: {
                Authorization: `Bearer ${token}`, // Authorization 헤더에 토큰 추가
                "Content-Type": "application/json",
            }
        });
        return response.data.nickname; // 서버의 응답에서 닉네임 반환
    } catch (error) {
        console.error('현재 닉네임 가져오기 오류:', error);
        throw error;
    }
};

// 닉네임 수정 API
export const changeNickname = async (newNickname) => {
    try {
        const token = await AsyncStorage.getItem('token'); // AsyncStorage에서 JWT 토큰 가져오기
        const response = await axios.post(`${API_URL}/api/user/nickname`, 
            { nickname: newNickname }, 
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Authorization 헤더에 토큰 추가
                    "Content-Type": "application/json",
                }
            }
        );
        return response.data; // 서버의 응답 반환
    } catch (error) {
        console.error('닉네임 변경 오류:', error);
        throw error;
    }
};
  
// 비밀번호 확인 API
export const checkPassword = async (password) => {
  try {
    const response = await axios.post("/api/user/checkPassword", { password });
    return response.data.isValid;
  } catch (error) {
    console.error('비밀번호 확인 오류:', error);
    throw error;
  }
};

// 회원 탈퇴 API
export const deleteUserAccount = async (password) => {
  try {
    const token = await AsyncStorage.getItem('token');

    // 서버에 회원 탈퇴 요청
    const response = await apiClient.post("/api/user/deleteUser", { password }, {
      headers: {
        Authorization: `Bearer ${token}`, // JWT 토큰을 Authorization 헤더에 추가
      },
    });

    console.log("회원 탈퇴 요청 반환 데이터: ", response.data);
    return response.data; // 서버 반환 성공 여부
  } catch (error) {
    console.error("회원 탈퇴 요청 오류:", error);
    throw error;
  }
};