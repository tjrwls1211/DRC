import React from 'react';
import { getWeeklySAcl, getSAcl } from '../../api/driveInfoAPI';
import AnalysisScreen from './AnalysisScreen';

const SuddenAcceleration = () => {
  const fetchData = async (twoWeeksAgo, currentDate) => {
    // 급가속 데이터 가져오기
    return await getWeeklySAcl(twoWeeksAgo, currentDate);
  };

  const todayData = async () => {
    // const today = new Date().toISOString().slice(0, 10); // 오늘 날짜
    const today = '2024-11-06'; // 테스트
    return await getSAcl(today); // 오늘 날짜로 급가속 데이터 조회
  };

  return (
    <AnalysisScreen 
      todayData={todayData}
      fetchData={fetchData}
      title="급가속 분석"
      chartDataKey="sacl"
      loadingText="급가속 분석 중..."

      themeColor="#009688" // 테마색
    />
  );
};

export default SuddenAcceleration;

/*
const SuddenAcceleration = () => {
  const [weeklyChange, setWeeklyChange] = useState(0); // 전주 대비 변환량 저장
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
        console.log("급가속 --------------");
        // const result = await getWeeklySAcl(twoWeeksAgo, currentDate);
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
      <View style={[styles.loadingContainer, { backgroundColor: isDarkMode ? '#121212' : '#ffffff' }]}>
        <ActivityIndicator size="large" color="#009688" />
        <Text style={{ color: isDarkMode ? '#d3d3d3' : '#000' }}>분가속 분석 중...</Text>
      </View>
    );  // 로딩 표시 컴포넌트
  }

  // LineChart 크기 설정
  const chartWidth = chartData.labels.length * 60; // 데이터 수에 따라 그래프 내부 너비 설정
  const chartHeight = 300;

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#009688' }]}>
      <View style={[styles.headerBar, { backgroundColor: isDarkMode ? '#333333' : '#ffffff' }]}>
        <Image 
          source={
            isDarkMode 
              ? require("../../../assets/darkmode-LOGO.png") // 다크 모드 이미지
              : require("../../../assets/iconizer-LOGO.png") // 라이트 모드 이미지
          } 
          style={styles.logo} 
        />
        <Text style={[styles.headerText, { color: isDarkMode ? '#ffffff' : '#009688' }]}>급가속 분석</Text>
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
            decimalPlaces: 0,
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

      <Text style={{
            color: isDarkMode ? '#b0b0b0' : '#2F4F4F',
            textAlign: 'right',
            marginRight: 10,
            fontSize: 12, // 작은 텍스트 크기
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
    padding: 10, // 화면 여백 조정
    justifyContent: 'center',
    backgroundColor: '#009688',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: 50,
    paddingHorizontal: 10,
    borderRadius: 8, // 라운드 효과 추가
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
    marginRight: 10,
  },
  headerText: {
    color: '#2F4F4F',
    fontSize: 22,
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
*/