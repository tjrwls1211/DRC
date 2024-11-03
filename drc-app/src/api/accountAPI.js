// 계정 관련 API (로그아웃, 회원탈퇴, 비밀번호 확인·변경)
import axios from 'axios';
import { API_URL } from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    }
  });
  
// 비밀번호 확인 API
export const verifyPassword = async (password) => {
  console.log("비밀번호 인증 API 요청");
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.post(`${API_URL}/user/verifyPassword`, 
      { pw: password },
      {
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
          }
      }
  );
    console.log("비밀번호 확인 서버 반환 데이터: ", response.data);
    return response.data.success;
  } catch (error) {
    console.error('비밀번호 확인 오류:', error);
    throw error;
  }
};

// 비밀번호 변경 API
export const changePassword = async (newPassword) => {
  console.log("비밀번호 변경 API 요청");
  try {
    const token = await AsyncStorage.getItem('token');

    const response = await axios.patch(`${API_URL}/user/modifyPassword`, 
      {
        pw: newPassword
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      }
    );

    console.log("비밀번호 변경 요청 반환값: ", response.data);
    return response.data; // 성공 여부와 메시지를 반환
  } catch (error) {
    console.error('비밀번호 변경 오류:', error);
    throw error; // 오류 발생 시 예외 처리
  }
};

// 회원 탈퇴 API
export const deleteUserAccount = async (password) => {
  try {
    const token = await AsyncStorage.getItem('token');

    // 서버에 회원 탈퇴 요청
    const response = await apiClient.delete("/user/deleteUser", {
      headers: {
        'AuthAuthorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: { pw: password } // 비밀번호를 body에 포함
    });

    console.log("회원 탈퇴 요청 반환 데이터: ", response.data);
    return response.data;
  } catch (error) {
    console.error("회원 탈퇴 요청 오류(api코드):", error);
    throw error;
  }
};

