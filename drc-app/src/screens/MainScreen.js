import React from "react";
import {View, StyleSheet, Button} from 'react-native';
import Card from "../components/Card";
import {useNavigation} from '@react-navigation/native';
import AnalysisTabs from "./Analysis/AnalysisTabs";

const MainScreen = () => {
    const navigation = useNavigation(); // 네비게이션 훅 사용

    // 각 분석 화면 이동 함수 정의
    const goToSuddenAcceleration = () => {
        navigation.navigate('AnalysisTabs', { screen: '급가속 분석' });
    };

    const goToSuddenBraking = () => {
        navigation.navigate('AnalysisTabs', { screen: '급정거 분석' });
    };

    const goToSamePedal = () => {
        navigation.navigate('AnalysisTabs', { screen: '페달동시사용 분석' });
    };

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Button title="마이페이지" onPress={() => navigation.navigate('MypageScreen')} />
                <Button title="설정" onPress={() => navigation.navigate('SettingsScreen')} />
            </View>
            
            <View style={styles.cardContainer}>
                <Card title="급가속 분석 결과" onPress={goToSuddenAcceleration} />
                <Card title="급정거 분석 결과" onPress={goToSuddenBraking} />
                <Card title="페달동시사용 분석 결과" onPress={goToSamePedal} />
            </View>
        </View>
    );
};

// 스타일 정의
const styles = StyleSheet.create({
    container: {
      flex: 1, // 부모 컨테이너가 화면 전체를 차지하도록 설정
      padding: 20, // 전체 화면에 여백 추가
      justifyContent: 'flex-start', // 자식 요소들을 위에서부터 정렬
      backgroundColor: '#f8f8f8', // 전체 배경 색상
    },
    header: {
      flexDirection: 'row', // 버튼들을 수평으로 배치
      justifyContent: 'space-between', // 버튼 간의 간격을 균등하게 조정
      marginBottom: 20, // 아래쪽 여백 추가
    },
    cardContainer: {
      flex: 1, // 카드 컨테이너가 남은 공간을 차지하도록 설정
      justifyContent: 'center', // 카드들을 중앙에 정렬
    },
  });

export default MainScreen;