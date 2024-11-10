import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text, ActivityIndicator, Image, ScrollView } from 'react-native';
import AnalysisCard from '../../components/Card/AnalysisCard';
import { LineChart } from 'react-native-chart-kit';
import { getWeeklySAcl } from '../../api/driveInfoAPI';
import { getDate } from '../../utils/getDate';
import { weeklyDiff } from '../../utils/weeklyDiff';

const SuddenAcceleration = () => {
  const [weeklyChange, setWeeklyChange] = useState(0); // 전주 대비 변환량 저장
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
        //const result = await getWeeklySAcl(twoWeeksAgo, currentDate);
        // 테스트 데이터 ↓ -----
        const result = [
          {"date": "2024-10-21", "sacl": Math.floor(Math.random() * 21)},
          {"date": "2024-10-22", "sacl": Math.floor(Math.random() * 21)},
          {"date": "2024-10-23", "sacl": Math.floor(Math.random() * 21)},
          {"date": "2024-10-24", "sacl": Math.floor(Math.random() * 21)},
          {"date": "2024-10-25", "sacl": Math.floor(Math.random() * 21)},
          {"date": "2024-10-26", "sacl": Math.floor(Math.random() * 21)},
          {"date": "2024-10-27", "sacl": Math.floor(Math.random() * 21)},
          {"date": "2024-10-28", "sacl": Math.floor(Math.random() * 21)},
          {"date": "2024-10-29", "sacl": Math.floor(Math.random() * 21)},
          {"date": "2024-10-30", "sacl": Math.floor(Math.random() * 21)},
          {"date": "2024-10-31", "sacl": Math.floor(Math.random() * 21)},
          {"date": "2024-11-01", "sacl": Math.floor(Math.random() * 21)},
          {"date": "2024-11-02", "sacl": Math.floor(Math.random() * 21)},
          {"date": "2024-11-03", "sacl": Math.floor(Math.random() * 21)},
        ];
        // 테스트 데이터 ↑ -----
        clearTimeout(timeoutId); // 응답이 오면 타이머 종료
        console.log("급가속 데이터 요청 결과", result);
        
        // 날짜 및 분석결과(횟수) 추출, 형식 변경
        const labels = result.map(item => item.date.replace('2024-', '').replace('-', '.'));
        const data = result.map(item => item.sacl);

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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#009688" />
        <Text style={styles.loadingText}>분가속 분석 중...</Text>
      </View>
    );  // 로딩 표시 컴포넌트
  }

  // LineChart 크기 설정
  const chartWidth = chartData.labels.length * 60; // 데이터 수에 따라 그래프 내부 너비 설정
  const chartHeight = 300;

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Image source={require("../../../assets/LOGO.png")} style={styles.logo} />
        <Text style={styles.headerText}>급가속 분석</Text>
      </View>
      
      <AnalysisCard num={weeklyChange.toString()} />

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
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
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
            marginHorizontal: 7,
          }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    backgroundColor: '#009688',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
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
    color: '#009688',
    fontSize: 22,
    textAlign: 'center',
    flex: 1,
    fontWeight: 'bold', // 볼드체로 변경
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 10,
    color: '#009688',
    fontSize: 18,
  },
});

export default SuddenAcceleration;