// 세 분석화면의 공통된 로직과 UI를 가진 "분석화면" 컴포넌트
// 데이터 fetching, 차트 렌더링, 로딩 상태 처리 담당
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView } from 'react-native';
import AnalysisCard from '../../components/Card/AnalysisCard';
import { LineChart } from 'react-native-chart-kit';
import { getDate } from '../../utils/getDate';
import { weeklyDiff } from '../../utils/weeklyDiff';

const AnalysisScreen = ({ fetchDataFunc, title, dataKey }) => {
  const [weeklyChange, setWeeklyChange] = useState(0);
  const [chartData, setChartData] = useState({ labels: [], datasets: [{ data: [] }] });
  const [loading, setLoading] = useState(true);
  
  const { currentDate, twoWeeksAgo } = getDate();

  useEffect(() => {
    const fetchData = async () => {
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, 3000);

      try {
        const result = await fetchDataFunc(twoWeeksAgo, currentDate);
        clearTimeout(timeoutId);
        
        const labels = result.map(item => item.date.replace('2024-', '').replace('-', '.'));
        const data = result.map(item => item[dataKey]);

        setChartData({ labels, datasets: [{ data }] });

        const change = weeklyDiff(data);
        setWeeklyChange(change.change);
      } catch (error) {
        console.error("데이터 가져오기 오류: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentDate, twoWeeksAgo]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#009688" />
        <Text style={styles.loadingText}>{title} 분석 중...</Text>
      </View>
    );
  }

  const chartWidth = chartData.labels.length * 60;
  const chartHeight = 300;

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Image source={require("../../../assets/LOGO.png")} style={styles.logo} />
        <Text style={styles.headerText}>{title}</Text>
      </View>
      <AnalysisCard num={weeklyChange.toString()} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <LineChart
          data={chartData}
          width={chartWidth}
          height={chartHeight}
          yAxisLabel=""
          yAxisSuffix="회"
          chartConfig={{
            backgroundColor: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(47, 79, 79, ${opacity})`,
            labelColor: () => `#2F4F4F`,
            style: { borderRadius: 16 },
            propsForDots: { r: '4', strokeWidth: '1.5', stroke: '#009688' },
          }}
          bezier
          style={{ marginVertical: 8, borderRadius: 16, marginHorizontal: 7 }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // TODO: 스타일 코드 작성 -> 다크모드 코드 업데이트 후 추가
});

export default AnalysisScreen;
