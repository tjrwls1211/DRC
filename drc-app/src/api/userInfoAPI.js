// 사용자 정보 가져오기 API
import axios from 'axios';
import { API_URL } from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage';

// 개인 정보 가져오기 API
export const fetchUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
  
       // 헤더에 토큰 포함하여 요청 보내기
      const response = await axios.get("/api/user/info", {
        headers: {
          Authorization: `Bearer ${token}`,  // 토큰을 Bearer 방식으로 설정
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('개인 정보 가져오기 오류:', error);
      throw error;
    }
  };