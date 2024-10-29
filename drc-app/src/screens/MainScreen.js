import React, { useState } from "react";
import {View, StyleSheet, Button, TouchableOpacity, Text} from 'react-native';
import ViewCard from "../components/Card/ViewCard";
import DrivingScoreEvaluator from "../components/Score/DrivingScoreEvaluator";
import TouchCard from "../components/Card/TouchCard";
import {useNavigation} from '@react-navigation/native';
import AnalysisTabs from "./Analysis/AnalysisTabs";
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/Ionicons';
import Icon4 from 'react-native-vector-icons/FontAwesome5';

const MainScreen = () => {
    const [score, setScore] = useState(100); // Lift score state up to MainScreen

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
            {/*헤더 부분*/}
            <View style={{ backgroundColor: '#f8f8f8', padding: 20, marginTop: 25}}>
                <View style={styles.header}>
                    <Icon4 name="user-circle" size={27} color="#000" onPress={() => navigation.navigate('MypageScreen')} />
                    <Icon3 name="settings-outline" size={27} color="#000" onPress={() => navigation.navigate('SettingsScreen')} />
                </View>
                <Text style={{ fontSize: 30, fontWeight: 'bold' }}>DRC</Text>
            </View>
            
            <View style={{ flex: 1, backgroundColor: '#ffffff', padding: 20 }}>

            <ViewCard name="OOO" score={score} />

            <Text style={{marginTop: 15, fontWeight:'bold', fontSize: 15}}>운전 습관</Text>
            <View style={styles.cardContainer}>
                {/* analysis_count= 변수설정하기*/}
                <TouchCard iconSource={require('../../assets/acceleration-icon.png')} analysis_item="급가속 분석 결과" analysis_count="5회" onPress={goToSuddenAcceleration} />
                <TouchCard iconSource={require('../../assets/brake-icon.png')} analysis_item="급정거 분석 결과" analysis_count="7회" onPress={goToSuddenBraking} /> 
                <TouchCard iconSource={require('../../assets/pedal-icon.png')} analysis_item="페달동시사용 분석 결과" analysis_count="2회" onPress={goToSamePedal} />
            </View>

            {/* Acceleration Monitor Component */}
                {/* Pass setScore to update score from AccelerationMonitor */}
                <DrivingScoreEvaluator score={score} setScore={setScore} />


            {/* 챗봇 버튼 */}
            <TouchableOpacity 
                  style={styles.chatbotButton}
                  onPress={() => navigation.navigate("ChatbotScreen", { screen: 'ChatbotScreen' })}>
                    <Icon3 name="chatbubbles" size={30} color="#fff" />
            </TouchableOpacity>
        </View>
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1, // 부모 컨테이너가 화면 전체를 차지하도록 설정
      //padding: 20, // 전체 화면에 여백 추가
      justifyContent: 'flex-start', // 자식 요소들을 위에서부터 정렬
      backgroundColor: '#ffffff', // 전체 배경 색상
    },
    header: {
      flexDirection: 'row', // 버튼들을 수평으로 배치
      justifyContent: 'space-between', // 버튼 간의 간격을 균등하게 조정
      marginBottom: 20, // 아래쪽 여백 추가
      backgroundColor: '#f8f8f8'
    },
    cardContainer: {
      flex: 1, // 카드 컨테이너가 남은 공간을 차지하도록 설정
      justifyContent: 'center', // 카드들을 중앙에 정렬
      marginBottom: 45
      
    },
    chatbotButton: {
        position: 'absolute', // 버튼을 화면 하단에 고정
        bottom: 20, // 하단 여백 설정
        right: 30, // 우측 여백 설정
        backgroundColor: '#007AFF', // 버튼 배경색
        width: 60, // 버튼 너비
        height: 60, // 버튼 높이
        borderRadius: 30, // 둥근 버튼 모양
        justifyContent: 'center', // 아이콘을 중앙에 정렬
        alignItems: 'center', // 아이콘을 중앙에 정렬
        shadowColor: '#000', // 그림자 색상
        shadowOffset: { width: 0, height: 2 }, // 그림자 위치
        shadowOpacity: 0.3, // 그림자 불투명도
        shadowRadius: 4, // 그림자 반경
        elevation: 5, // 안드로이드 그림자 효과
      },
});

export default MainScreen;