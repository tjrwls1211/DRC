import axios from 'axios';

export const everyday = async (date, keyword) => {
  const url = ""; // 기본 URL

  try {
    const response = await axios.get(url, {
      params: {
        carId: 3, // carId를 쿼리 파라미터로 추가
        date: date, // 날짜를 쿼리 파라미터로 전달
        keyword: keyword // 키워드를 쿼리 파라미터로 전달
      }
    });
    console.log('Data sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending data:', error);
  }
};