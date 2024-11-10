import React from 'react'; 
import { View, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from "../Mode/ThemeContext"; // 다크 모드 Context import

const AnalysisCard = ({ num, circleBackgroundColor, borderColor }) => {
    const { isDarkMode } = useTheme(); // 다크 모드 상태 가져오기

    return (
        <View style={[styles.customCard, { backgroundColor: isDarkMode ? '#333333' : '#ffffff' }]}>
            <View style={[styles.innerCard, { borderColor: borderColor || '#009688' }]}>
                {/* 상단에 카드에 걸쳐진 사진이 들어간 원 */}
                {/* 
                <View style={[styles.circle, { backgroundColor: circleBackgroundColor || (isDarkMode ? '#444444' : '#ffffff') }]}>
                    <Image 
                        source={require('../../../assets/LOGO.png')} 
                        style={styles.logo} 
                    />
                </View>
                */}
                <Text style={[styles.subText, { color: isDarkMode ? '#ffffff' : '#2F4F4F' }]}> 저번주 대비</Text>
                <View style={styles.row}>
                    <Text style={[styles.num, { color: isDarkMode ? '#ffffff' : '#2F4F4F' }]}>{num}회</Text>
                    <Icon name="arrow-up-bold" size={40} color={isDarkMode ? '#4CAF50' : '#009688'} /> 
                    <Icon name="arrow-down-bold" size={40} color={isDarkMode ? '#FF5252' : '#2F4F4F'} /> 
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    customCard: {
        height: '35%',
        width: '95%', // 카드 너비 설정
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 15, // 둥근 모서리
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        margin: 10, // 카드 간격
        marginBottom: 20,
        elevation: 5, // 안드로이드 그림자 효과
    },
    innerCard: {
        flex: 1,
        width: '100%',
        borderRadius: 10, // 내부 둥근 흰색 테두리 모양
        borderWidth: 1,
        borderColor: '#009688', // 흰색 테두리 색상
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10, // 상단 여백을 주어 원이 걸치도록 함
    },
    circle: {
        position: 'absolute',
        top: -70, // 카드 상단에 걸쳐 위치
        width: 100,
        height: 100,
        borderRadius: 70, // 원 모양
        backgroundColor: 'white', // 검정색 원
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000', // 그림자 색상
        shadowOffset: { width: 0, height: 2 }, // 그림자 위치
        shadowOpacity: 0.5, // 그림자 투명도
        shadowRadius: 4, // 그림자 흐림 효과
        elevation: 5, // 안드로이드에서 그림자 효과
        marginTop: 20,
    },
    logo: {
        width: 40,
        height: 40,
        resizeMode: 'contain', // 로고 크기 조정
    },
    subText: {
        fontSize: 18,
        color: '#2F4F4F', // 흰색 텍스트
        textAlign: 'center',
        marginBottom: 10, // 텍스트와 숫자 사이의 간격
    },
    num: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#2F4F4F', // 흰색 텍스트
        textAlign: 'center',
        marginRight: 10, // 화살표 아이콘과의 간격
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default AnalysisCard;
