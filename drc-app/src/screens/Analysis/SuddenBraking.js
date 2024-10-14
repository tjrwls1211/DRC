import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AnalysisCard from '../../components/Card/AnalysisCard';

const SuddenBraking = () => {
  return (
    <View style={styles.container}>
        <AnalysisCard num="2" /> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // 부모 컨테이너가 화면 전체를 차지하도록 설정
    padding: 20, // 전체 화면에 여백 추가
    justifyContent: 'center', // 자식 요소들을 위에서부터 정렬
    backgroundColor: '#f8f8f8', // 전체 배경 색상
  },
});

export default SuddenBraking;
