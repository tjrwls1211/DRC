import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions} from 'react-native';
import AnalysisCard from '../../components/Card/AnalysisCard';
import { LineChart } from 'react-native-chart-kit';
import { getAcceleration } from '../../api/driveInfoAPI';

const SuddenAcceleration = () => {
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
        
        // // 결과 처리: 날짜와 주행 가속 횟수 추출
        // const labels = result.map(item => item.date); // 날짜
        // const data = result.map(item => item.accelerationCount); // 가속 횟수

        // setChartData({
        //   labels,
        //   datasets: [{ data }],
        // });
      } catch (error) {
        console.error("데이터 가져오기 오류: ", error);
      }
    };

    fetchData();
  }, [currentDate, twoWeeksAgo]); // 컴포넌트가 마운트될 때 데이터 가져오기


  // LineChart 크기 조정용
  const chartWidth = Dimensions.get('window').width - 32; // 화면 너비보다 32 픽셀 줄임
  const chartHeight = 300; // 기존 높이보다 낮게 조정

  return (
    <View style={styles.container}>
      <AnalysisCard num="5" />

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
