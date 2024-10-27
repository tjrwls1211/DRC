// 사용자 관련 API (비밀번호 확인, 닉네임 수정 등)
import axios from 'axios';
import { API_KEY } from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
    baseURL: API_KEY,
    headers: {
      "Content-Type": "application/json",
    }
  });

// 현재 닉네임 가져오기 API
export const fetchCurrentNickname = async () => {
    try {
        const token = await AsyncStorage.getItem('token'); // AsyncStorage에서 JWT 토큰 가져오기
        const response = await axios.get(`${API_KEY}/api/user/nickname`, {
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
        const response = await axios.post(`${API_KEY}/api/user/nickname`, 
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
  
 