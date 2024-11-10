import React from 'react';
import { View, StyleSheet, Dimensions,Image, Text} from 'react-native';
import AnalysisCard from '../../components/Card/AnalysisCard';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from "../../components/Mode/ThemeContext"; // 다크 모드 Context import

const SamePedal = () => {
  const { isDarkMode } = useTheme(); // 다크 모드 상태 가져오기
  const chartWidth = Dimensions.get('window').width - 32; // 화면 너비보다 32 픽셀 줄임
  const chartHeight = 300; // 기존 높이보다 낮게 조정

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
        <Text style={[styles.headerText, { color: isDarkMode ? '#ffffff' : '#009688' }]}>페달동시사용 분석</Text>
      </View>
      <AnalysisCard num="0" circleBackgroundColor={isDarkMode ? '#2f4f4f' : '#FFFFFF'} borderColor={isDarkMode ? '#009688' : '#009688'}/>
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
        yAxisLabel=""
        yAxisSuffix="회"
        chartConfig={{
          backgroundColor: isDarkMode ? '#333333' : '#ffffff',
          backgroundGradientFrom: isDarkMode ? '#121212' : '#ffffff',
          backgroundGradientTo: isDarkMode ? '#121212' : '#ffffff',
          decimalPlaces: 2,
          color: (opacity = 1) => isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(47, 79, 79, ${opacity})`,
          labelColor: () => isDarkMode ? '#ffffff' : '#2F4F4F',
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '4',
            strokeWidth: '1.5',
            stroke: '#0095A1',
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          marginHorizontal: 7,
          borderWidth: 1,
          borderColor: isDarkMode ? '#009688' : '#009688', // 테두리 색상
          borderRadius: 16,
          overflow: 'hidden',
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



export default SamePedal;
