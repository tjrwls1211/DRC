import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text} from 'react-native';
import AnalysisCard from '../../components/Card/AnalysisCard';
import { LineChart } from 'react-native-chart-kit';


const SuddenAcceleration = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [] }], // 초기 데이터 배열을 빈 배열로 설정
  });
  const [loading, setLoading] = useState(true);
  

  // 날짜 계산 함수
  const getDates = () => {
    const currentDate = new Date(); // 현재 날짜
    const twoWeeksAgo = new Date(currentDate); // 현재 날짜 복사

    // 2주 전 날짜 계산
    twoWeeksAgo.setDate(currentDate.getDate() - 14);

    // 날짜 포맷팅 (년-월-일 형식)
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 0부터 시작하므로 +1
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    return {
      currentDate: formatDate(currentDate),
      twoWeeksAgo: formatDate(twoWeeksAgo),
    };
  };

  const { currentDate, twoWeeksAgo } = getDates(); // 날짜 가져오기
  console.log("날짜 계산 결과 - (오늘):", currentDate, "(2주전): ", twoWeeksAgo);

  //const result = await getAcceleration(currentDate, twoWeeksAgo);
  // 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAcceleration(twoWeeksAgo, currentDate);
        console.log("가속 데이터 요청", result);
        
        // 날짜와 sacl 추출 및 형식 변경
        const labels = result.map(item => item.date.replace('2024-', '').replace('-', '.'));
        const data = result.map(item => item.sacl);

        // 상태 업데이트
        setChartData({
          labels,
          datasets: [{ data }],
        });

        // 콘솔에 결과 출력
        console.log("Labels:", labels);
        console.log("Data:", data);
      } catch (error) {
        console.error("데이터 가져오기 오류: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentDate, twoWeeksAgo]); // 컴포넌트가 마운트될 때 데이터 가져오기

  if (loading) {
    return <View><Text>Loading...</Text></View>; // 로딩 중일 때 표시할 컴포넌트
  }

  // LineChart 크기 조정용
  const chartWidth = Dimensions.get('window').width - 32; // 화면 너비보다 32 픽셀 줄임
  const chartHeight = 300; // 기존 높이보다 낮게 조정

  return (
    <View style={styles.container}>
      <AnalysisCard num="5" />

      <LineChart
        data={{
          labels: chartData.labels,
          datasets: chartData.datasets,
        }}
        width={chartWidth}
        height={chartHeight}
        yAxisLabel=""
        yAxisSuffix="회"
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(47, 79, 79, ${opacity})`,
          labelColor: () => `#2F4F4F`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '4', // 점 크기 줄이기
            strokeWidth: '1.5', // 점 외곽선 크기 줄이기
            stroke: '#009688',
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
          marginHorizontal:7,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10, // 화면 여백 조정
    justifyContent: 'center',
    backgroundColor: '#009688',
  },
});

export default SuddenAcceleration;
