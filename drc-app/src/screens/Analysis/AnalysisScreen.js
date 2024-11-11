// 세 분석화면의 공통된 로직과 UI를 가진 "분석화면 컴포넌트"
// 데이터 fetching, 그래프 렌더링, 로딩 상태 처리 담당
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView } from 'react-native';
import AnalysisCard from '../../components/Card/AnalysisCard';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from "../../components/Mode/ThemeContext"; // 다크 모드 Context import
import { getDate } from '../../utils/getDate';
import { weeklyDiff } from '../../utils/weekliyDiff';

// ☆ 파라미터 { 주행데이터, 화면 표시 제목, 서버 반환객체에서 값 추출용 key명(ex-sbrk), 로딩 표시 텍스트}
const AnalysisScreen = ({ fetchData, title, chartDataKey, loadingText, themeColor }) => {
  const [weeklyChange, setWeeklyChange] = useState(0); // 주간 변화량
  const [chartData, setChartData] = useState({ // 그래프 데이터
    labels: [],
    datasets: [{ data: [] }], // 초기 데이터 빈 배열 설정
  });
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();
  const { currentDate, twoWeeksAgo } = getDate(); // 오늘, 2주전 날짜 가져오기

  // 데이터 fetching 및 그래프 렌더링
  useEffect(() => {
    const fetchData = async () => {
      // 로딩: 3초 후 종료
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, 3000);

      try {
        console.log(title, "---------");
        // 데이터 fetching
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
        clearTimeout(timeoutId); // 응답 오면 타이머 종료
        console.log(title, "데이터 요청 결과: ", result);
        
        // 반환결과에서 날짜 및 분석결과(횟수) 추출, 형식 변경
        const labels = result.map(item => item.date.replace('2024-', '').replace('-', '.'));
        const data = result.map(item => item.sbrk);

        // 반환 데이터 그래프 배열에 저장
        setChartData({
          labels,
          datasets: [{ data }],
        });
        console.log("Labels:", labels);
        console.log("Data:", data);

        // 전주 대비 변화량 분석
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
  }, [currentDate, twoWeeksAgo]);

  // 로딩 UI
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDarkMode ? '#121212' : '#ffffff' }]}>
        <ActivityIndicator size="large" color="#009688" />
        <Text style={{ color: isDarkMode ? '#d3d3d3' : '#000' }}>{loadingText}</Text>
      </View>
    );
  }

  // 그래프 크기 설정
  const chartWidth = chartData.labels.length * 60;
  const chartHeight = 300;

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : themeColor }]}>
      <View style={[styles.headerBar, { backgroundColor: isDarkMode ? '#333333' : '#ffffff' }]}>
        <Image source={isDarkMode ? require("../../../assets/darkmode-LOGO.png") : require("../../../assets/iconizer-LOGO.png")} style={styles.logo} />
        <Text style={[styles.headerText, { color: isDarkMode ? '#ffffff' : themeColor }]}>{title}</Text>
      </View>

      <AnalysisCard num={weeklyChange.toString()} circleBackgroundColor={isDarkMode ? themeColor : '#FFFFFF'} borderColor={isDarkMode ? themeColor : themeColor} />

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
            decimalPlaces: 0,
            color: (opacity = 1) => isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(47, 79, 79, ${opacity})`,
            labelColor: () => isDarkMode ? '#ffffff' : '#2F4F4F',
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '4',  // 점 크기 줄이기
              strokeWidth: '1.5',  // 점 외곽선 크기 줄이기
              stroke: themeColor,
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            marginHorizontal: 7,
            borderWidth: 1,
            borderColor: isDarkMode ? themeColor : themeColor, // 테두리 색상
            borderRadius: 16,
            overflow: 'hidden',
          }}
      />
      </ScrollView>

      <Text style={{
            color: isDarkMode ? '#b0b0b0' : '#2F4F4F',
            textAlign: 'right',
            marginRight: 10,
            fontSize: 12,
            marginBottom: 15,
        }}>
            * 그래프를 옆으로 스크롤하여 정보를 확인하세요
        </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    padding: 10,
    justifyContent: 'center'
  },
  headerBar: { 
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 15,
    marginTop:15,
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
    marginRight: 10
  },
  headerText: { 
    fontSize: 22,
    textAlign: 'center',
    flex: 1,
    fontWeight: 'bold',
    marginLeft: -35,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  chartStyle: { 
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden'
  },
  infoText: { 
    textAlign: 'right',
    marginRight: 10,
    fontSize: 12,
    marginBottom: 15
  },
});

export default AnalysisScreen;