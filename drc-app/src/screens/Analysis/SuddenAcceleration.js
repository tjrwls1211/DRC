import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import AnalysisCard from '../../components/Card/AnalysisCard';
import { LineChart } from 'react-native-chart-kit';

const SuddenAcceleration = () => {
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
        width={Dimensions.get('window').width - 16} // 화면 너비에 맞게 조정
        height={330}
        yAxisLabel="$"
        yAxisSuffix="k"
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 2, // 소수점 자리수
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
        bezier // 부드러운 곡선 형태로 표시
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // 부모 컨테이너가 화면 전체를 차지하도록 설정
    padding: 7, // 전체 화면에 여백 추가(☆ Chart 여백에 맞춤 수정 필요)
    justifyContent: 'center', // 자식 요소들을 위에서부터 정렬
    backgroundColor: '#f8f8f8', // 전체 배경 색상
  },
});

export default SuddenAcceleration;