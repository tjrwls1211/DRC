import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import AnalysisCard from '../../components/Card/AnalysisCard';
import { LineChart } from 'react-native-chart-kit';
import { getWeeklySPedal } from '../../api/driveInfoAPI';
import { getDate } from '../../utils/getDate';

const SamePedal = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [] }], // 초기 데이터 빈 배열로
  });
  const [loading, setLoading] = useState(true);
  
  const { currentDate, twoWeeksAgo } = getDate(); // 날짜 가져오기
  console.log("날짜 계산 결과 - (오늘):", currentDate, "(2주전): ", twoWeeksAgo);

  // 급가속 분석 결과 조회
  useEffect(() => {
    const fetchData = async () => {
      const timeoutId = setTimeout(() => {
        setLoading(false); // 3초 후 로딩 종료
      }, 3000);

      try {
        console.log("양발운전 --------------");
        const result = await getWeeklySPedal(twoWeeksAgo, currentDate);
        clearTimeout(timeoutId); // 응답이 오면 타이머 종료
        console.log("양발운전 데이터 요청 결과", result);
        
        // 날짜 및 분석결과(횟수) 추출, 형식 변경
        const labels = result.map(item => item.date.replace('2024-', '').replace('-', '.'));
        const data = result.map(item => item.bothPedal);

        // 배열에 저장
        setChartData({
          labels,
          datasets: [{ data }],
        });

        console.log("Labels:", labels);
        console.log("Data:", data);
      } catch (error) {
        console.error("데이터 가져오기 오류: ", error);
      } 
      finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentDate, twoWeeksAgo]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#009688" />
        <Text style={styles.loadingText}>양발운전 분석 중...</Text>
      </View>
    );  // 로딩 표시 컴포넌트
  }


  // LineChart 크기 설정
  const chartWidth = Dimensions.get('window').width - 32; // 화면 너비보다 32 픽셀 줄임
  const chartHeight = 300; // 기존 높이보다 낮게 조정

  return (
    <View style={styles.container}>
      <AnalysisCard num="0" />

      <LineChart
        data={{
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              data: [20, 45, 28, 80, 99, 43],
            },
          ],
        }}
        width={chartWidth}
        height={chartHeight}
        yAxisLabel="$"
        yAxisSuffix="k"
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(47, 79, 79, ${opacity})`,
          labelColor: () => `#2F4F4F`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '4', // 점 크기 줄이기
            strokeWidth: '1.5', // 점 외곽선 크기 줄이기
            stroke: '#009B77',
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
    backgroundColor: '#009B77',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // 로딩 화면 배경색
  },
  loadingText: {
    marginTop: 10,
    color: '#009688', // 로딩 텍스트 색상
    fontSize: 18,
  },
});

export default SamePedal;
