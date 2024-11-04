import React, { useState } from "react"; 
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native'; 
import ViewCard from "../components/Card/ViewCard"; 
import DrivingScoreEvaluator from "../components/Score/DrivingScoreEvaluator"; 
import TouchCard from "../components/Card/TouchCard"; 
import DRCLogoText from "../../assets/DRCLogo-text.png";
import { useNavigation } from '@react-navigation/native'; 
import Icon3 from 'react-native-vector-icons/Ionicons'; 
import Icon4 from 'react-native-vector-icons/FontAwesome5'; 

const MainScreen = () => { 
    const [score, setScore] = useState(100); 
    const navigation = useNavigation(); 

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
            {/* 헤더 부분 */} 
            <View style={styles.headerContainer}> 
                <View style={styles.header}> 
                    
                    <Icon4 name="user-circle" size={27} color="#ffffff" onPress={() => navigation.navigate('MypageScreen')} /> 
                    <Icon3 name="settings-outline" size={27} color="#ffffff" onPress={() => navigation.navigate('SettingsScreen')} /> 
                    
                </View> 
                <Text style={{ fontSize: 30, fontWeight: 'bold', color: "white" }}>DRC</Text>
            </View> 
 
            <View style={{ flex: 1, backgroundColor: '#ffffff', padding: 20 }}> 
                <ViewCard name="OOO" score={score} /> 
                <Text style={{ marginTop: -110, fontWeight: 'bold', fontSize: 15 }}>운전 습관</Text>
                <View style={styles.cardContainer}> 
                    {/* analysis_count= 변수설정하기 */} 
                    <TouchCard iconSource={require('../../assets/acceleration-icon.png')} analysis_item="급가속 분석 결과" analysis_count="5회" onPress={goToSuddenAcceleration} /> 
                    <TouchCard iconSource={require('../../assets/brake-icon.png')} analysis_item="급정거 분석 결과" analysis_count="7회" onPress={goToSuddenBraking} /> 
                    <TouchCard iconSource={require('../../assets/pedal-icon.png')} analysis_item="페달동시사용 분석 결과" analysis_count="2회" onPress={goToSamePedal} /> 
                </View> 

                {/* Acceleration Monitor Component */} 
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
        flex: 1, 
        justifyContent: 'flex-start', 
        backgroundColor: '#ffffff', 
    }, 
    headerContainer: { 
        backgroundColor: '#009688', 
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
        backgroundColor: '#009688' 
    }, 
    cardContainer: { 
        justifyContent: 'center', 
        marginBottom: 45, 
    }, 
    chatbotButton: { 
        position: 'absolute', 
        bottom: 20, 
        right: 30, 
        backgroundColor: '#007AFF', 
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
    dRCLogoTextWhite: {
        width : 70, 
        height : 70,
        marginTop: -5,
        marginLeft: -5
    },
}); 

export default MainScreen;