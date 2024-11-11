import React from 'react';
import { getWeeklySPedal, getSPedal } from '../../api/driveInfoAPI';
import AnalysisScreen from './AnalysisScreen';

const SamePedal = () => {
  // 데이터 fetching 함수
  const fetchData = async (twoWeeksAgo, currentDate) => {
    const result = await getWeeklySPedal(twoWeeksAgo, currentDate);
    return result;
  };

  const todayDate = async () => {
    const today = new Date().toISOString().slice(0, 10); // 오늘 날짜
    return await getSPedal(today); // 오늘 날짜로 급가속 데이터 조회
  };

  return (
    <AnalysisScreen 
      todayDate={todayDate}
      fetchData={fetchData} // 데이터 fetching 함수 전달
      title="양발운전 분석" // 화면 제목
      chartDataKey="bothPedal" // 서버 반환 객체에서 값 추출 키
      loadingText="양발운전 분석 중..." // 로딩 텍스트

      themeColor="#009B77" // 테마 색
    />
  );
};

export default SamePedal;