import React, { useState } from "react"; 
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native'; 
import ViewCard from "../components/Card/ViewCard"; 
import DrivingScoreEvaluator from "../components/Score/DrivingScoreEvaluator"; 
import TouchCard from "../components/Card/TouchCard"; 
import DRCLogoText from "../../assets/DRCLogo-text.png";
import { useNavigation } from '@react-navigation/native'; 
import Icon3 from 'react-native-vector-icons/Ionicons'; 
import Icon4 from 'react-native-vector-icons/FontAwesome5'; 
import { useTheme } from "../components/Mode/ThemeContext";
import { PanGestureHandler } from 'react-native-gesture-handler';

const MainScreen = () => { 
    const [score, setScore] = useState(100); 
    const navigation = useNavigation(); 
    const { isDarkMode } = useTheme();

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
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#ffffff' }]}> 
            {/* 헤더 부분 */} 
            <View style={[styles.headerContainer, { backgroundColor: isDarkMode ? '#009688' : '#009688' }]}> 
                <View style={styles.header}> 
                    <Icon4 name="user-circle" size={27} color="#ffffff" onPress={() => navigation.navigate('MypageScreen')} /> 
                    <Image source={DRCLogoText} style={styles.logo} />
                    <Icon3 name="settings-outline" size={27} color="#ffffff" onPress={() => navigation.navigate('SettingsScreen')} /> 
                </View> 
            </View> 

            <View style={{ flex: 1, backgroundColor: isDarkMode ? '#121212' : '#ffffff', padding: 20 }}> 
                <ViewCard name="OOO" score={score} /> 
                <Text style={{ 
                    marginTop: -110, 
                    fontWeight: 'bold', 
                    fontSize: 15, 
                    color: isDarkMode ? '#ffffff' : '#000' // 다크 모드일 때 글자색을 하얀색으로 설정
                }}>운전 습관</Text>
                <View style={styles.cardContainer}> 
                    <TouchCard iconSource={require('../../assets/acceleration-icon.png')} analysis_item="급가속 분석 결과" analysis_count="5회" onPress={goToSuddenAcceleration} /> 
                    <TouchCard iconSource={require('../../assets/brake-icon.png')} analysis_item="급정거 분석 결과" analysis_count="7회" onPress={goToSuddenBraking} /> 
                    <TouchCard iconSource={require('../../assets/pedal-icon.png')} analysis_item="페달동시사용 분석 결과" analysis_count="2회" onPress={goToSamePedal} /> 
                </View> 

                {/* Acceleration Monitor Component */} 
                <DrivingScoreEvaluator score={score} setScore={setScore} /> 

                {/* 챗봇 버튼 */} 
                <TouchableOpacity 
                    style={[styles.chatbotButton, { backgroundColor: isDarkMode ? '#2f4f4f' : '#009688' }]} 
                    onPress={() => navigation.navigate("ChatbotScreen", { screen: 'ChatbotScreen' })}> 
                    <Icon3 name="chatbubbles" size={30} color={isDarkMode ? '#d3d3d3' : '#fff'} /> 
                </TouchableOpacity> 
            </View> 
        </View> 
    ); 
}; 

const styles = StyleSheet.create({ 
    container: { 
        flex: 1, 
        justifyContent: 'flex-start', 
        backgroundColor: '#ffffff', 
    }, 
    headerContainer: { 
        padding: 20, 
        marginTop: 25, 
        height: "35%", 
        opacity: 0.9
    }, 
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 20, 
        marginTop: 10,
    }, 
    cardContainer: { 
        justifyContent: 'center', 
        marginBottom: 45, 
    }, 
    chatbotButton: { 
        position: 'absolute', 
        bottom: 20, 
        right: 30, 
        width: 60, 
        height: 60, 
        borderRadius: 30, 
        justifyContent: 'center', 
        alignItems: 'center', 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.3, 
        shadowRadius: 4, 
        elevation: 5, 
    }, 
    logo: {
        width: 130, // 로고의 너비 설정
        height: 130, // 로고의 높이 설정
        resizeMode: 'contain', // 로고 크기 조정
        opacity: 0.8,
    },
}); 

export default MainScreen; 
