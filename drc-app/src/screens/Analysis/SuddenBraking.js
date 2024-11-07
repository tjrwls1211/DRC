import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, Image } from 'react-native';
import AnalysisCard from '../../components/Card/AnalysisCard';
import { LineChart } from 'react-native-chart-kit';
import { getDate } from '../../utils/getDate';
import { getWeeklySBrk } from '../../api/driveInfoAPI';

const SuddenBraking = () => {
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
        console.log("급정거 --------------");
        const result = await getWeeklySBrk(twoWeeksAgo, currentDate);
        clearTimeout(timeoutId); // 응답이 오면 타이머 종료
        console.log("급정거 데이터 요청 결과", result);
        
        // 날짜 및 분석결과(횟수) 추출, 형식 변경
        const labels = result.map(item => item.date.replace('2024-', '').replace('-', '.'));
        const data = result.map(item => item.sbrk);

        // 반환 데이터 배열에 저장
        setChartData({
          labels,
          datasets: [{ data }],
        });

        // 콘솔에 결과 출력
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
        <Text style={styles.loadingText}>급정거 분석 중...</Text>
      </View>
    );  // 로딩 표시 컴포넌트
  }

  // LineChart 크기 설정
  const chartWidth = Dimensions.get('window').width - 32; // 화면 너비보다 32 픽셀 줄임
  const chartHeight = 300; // 기존 높이보다 낮게 조정

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Image source={require("../../../assets/LOGO.png")} style={styles.logo} />
        <Text style={styles.headerText}>급정거 분석</Text>
      </View>

      <AnalysisCard num="2" /> 

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
            r: '4',
            strokeWidth: '1.5',
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
    backgroundColor: '#0095A1',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: 50,
    paddingHorizontal: 10,
    borderRadius: 8, // 라운드 효과 추가
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    width: '95%', // 카드와 동일한 너비로 설정
    alignSelf: 'center', // 중앙 정렬
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  headerText: {
    color: '#0095A1',
    fontSize: 22,
    textAlign: 'center',
    flex: 1,
    fontWeight: 'bold', // 볼드체로 변경
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

export default SuddenBraking;
