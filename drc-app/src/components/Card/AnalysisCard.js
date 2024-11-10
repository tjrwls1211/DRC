import React from 'react'; 
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AnalysisCard = ({ num }) => {
    let iconName;
    let displayNum = num;

    if (num > 0) {
        iconName = "arrow-up-bold";
    } else if (num < 0) {
        iconName = "arrow-down-bold";
        displayNum = Math.abs(num); // 음수 절댓값으로 변환
    } else {
        iconName = "approximately-equal"; // 0일 경우 아이콘
    }

    return (
        <View style={styles.customCard}>
            <View style={styles.innerCard}>
            <Text style={styles.subText}>
    <Icon name="car-arrow-left" size={30} color="#2F4F4F" /> 저번주 대비
</Text>
                <View style={styles.row}>
                    <Text style={styles.num}>{displayNum}회</Text>
                    <Icon 
                        name={iconName} 
                        size={40} 
                        color={num > 0 ? "red" : num < 0 ? "lightgreen" : "#2F4F4F"}
                    />
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
        paddingTop: 30, // 상단 여백을 주어 원이 걸치도록 함
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
