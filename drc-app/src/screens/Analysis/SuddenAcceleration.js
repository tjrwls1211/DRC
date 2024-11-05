import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions} from 'react-native';
import AnalysisCard from '../../components/Card/AnalysisCard';
import { LineChart } from 'react-native-chart-kit';


const SuddenAcceleration = () => {
  
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
