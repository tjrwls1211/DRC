import React, { useEffect, useState} from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, Image, ScrollView } from 'react-native';
import AnalysisCard from '../../components/Card/AnalysisCard';
import { LineChart } from 'react-native-chart-kit';
import { getDate } from '../../utils/getDate';
import { getWeeklySBrk } from '../../api/driveInfoAPI';
import { weeklyDiff } from '../../utils/weekliyDiff';
import { useTheme } from "../../components/Mode/ThemeContext"; // 다크 모드 Context import

const SuddenBraking = () => {
  const [weeklyChange, setWeeklyChange] = useState(0);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [] }], // 초기 데이터 빈 배열로
  });
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme(); // 다크 모드 상태 가져오기

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
        // const result = await getWeeklySBrk(twoWeeksAgo, currentDate);
        // 테스트 데이터 ↓ -----
        const result = [
          {"date": "2024-10-21", "sbrk": Math.floor(Math.random() * 21)},
          {"date": "2024-10-22", "sbrk": Math.floor(Math.random() * 21)},
          {"date": "2024-10-23", "sbrk": Math.floor(Math.random() * 21)},
          {"date": "2024-10-24", "sbrk": Math.floor(Math.random() * 21)},
          {"date": "2024-10-25", "sbrk": Math.floor(Math.random() * 21)},
          {"date": "2024-10-26", "sbrk": Math.floor(Math.random() * 21)},
          {"date": "2024-10-27", "sbrk": Math.floor(Math.random() * 21)},
          {"date": "2024-10-28", "sbrk": Math.floor(Math.random() * 21)},
          {"date": "2024-10-29", "sbrk": Math.floor(Math.random() * 21)},
          {"date": "2024-10-30", "sbrk": Math.floor(Math.random() * 21)},
          {"date": "2024-10-31", "sbrk": Math.floor(Math.random() * 21)},
          {"date": "2024-11-01", "sbrk": Math.floor(Math.random() * 21)},
          {"date": "2024-11-02", "sbrk": Math.floor(Math.random() * 21)},
          {"date": "2024-11-03", "sbrk": Math.floor(Math.random() * 21)},
        ];
        // 테스트 데이터 ↑ -----
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

        // 전주 대비 분석
        const change = weeklyDiff(data);
        console.log("변화량:", change.change);
        setWeeklyChange(change.change);
      } catch (error) {
        console.error("데이터 가져오기 오류: ", error);
      } 
      finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentDate, twoWeeksAgo]); // 컴포넌트가 마운트될 때 데이터 가져오기

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDarkMode ? '#121212' : '#ffffff' }]}>
        <ActivityIndicator size="large" color="#009688" />
        <Text style={{ color: isDarkMode ? '#d3d3d3' : '#000' }}>급정거 분석 중...</Text>
      </View>
    );  // 로딩 표시 컴포넌트
  }

  // LineChart 크기 설정
  const chartWidth = chartData.labels.length * 60; // 데이터 수에 따라 그래프 내부 너비 설정
  const chartHeight = 300;

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#0095A1' }]}>
      <View style={[styles.headerBar, { backgroundColor: isDarkMode ? '#333333' : '#ffffff' }]}>
        <Image 
          source={
            isDarkMode 
              ? require("../../../assets/darkmode-LOGO.png") // 다크 모드 이미지
              : require("../../../assets/iconizer-LOGO.png") // 라이트 모드 이미지
          } 
          style={styles.logo} 
        />
        <Text style={[styles.headerText, { color: isDarkMode ? '#ffffff' : '#009688' }]}>급정거 분석</Text>
      </View>

      <AnalysisCard 
        num={weeklyChange.toString()}
        circleBackgroundColor={isDarkMode ? '#009688' : '#FFFFFF'}
        borderColor={isDarkMode ? '#009688' : '#009688'}
        style={styles.analysisCard} // 스타일 추가
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
            backgroundColor: isDarkMode ? '#121212' : '#ffffff',
            backgroundGradientFrom: isDarkMode ? '#121212' : '#ffffff',
            backgroundGradientTo: isDarkMode ? '#121212' : '#ffffff',
            decimalPlaces: 2,
            color: (opacity = 1) => isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(47, 79, 79, ${opacity})`,
            labelColor: () => isDarkMode ? '#ffffff' : '#2F4F4F',
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '4',  // 점 크기 줄이기
              strokeWidth: '1.5',  // 점 외곽선 크기 줄이기
              stroke: '#009688',
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            marginHorizontal: 7,
            borderWidth: 1,
            borderColor: isDarkMode ? '#009688' : '#009688', // 테두리 색상
            borderRadius: 16,
            marginHorizontal:7,
            overflow: 'hidden',
          }}
      />
      </ScrollView>
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
    marginBottom: 15,
    marginTop:25,
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
    fontSize: 18,
    textAlign: 'center',
    flex: 1,
    fontWeight: 'bold', // 볼드체로 변경
    marginLeft: -35
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

