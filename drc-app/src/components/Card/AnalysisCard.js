import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import BaseCard from './BaseCard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AnalysisCard = ({ num }) => {
    return (
        <BaseCard style={styles.customCard}>
            <Text style={styles.subText}>저번주 대비</Text>
            <View style={styles.row}>
                <Text style={styles.num}>{num}회</Text>
                <Icon name="arrow-up-bold" size={40} color="red" />
                <Icon name="arrow-down-bold" size={40} color="blue" />
            </View>
        </BaseCard>
    );
};

const styles = StyleSheet.create({
    customCard: {
        height: '35%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    subText: {
        fontSize: 18, // 일반 텍스트 크기
        color: '#333',
        textAlign: 'center',
    },
    num: {
        fontSize: 40, // 큰 텍스트 크기
        fontWeight: 'bold',
        color: '#000', // 검정색
        textAlign: 'center',
    },
    row: { // 컴포넌트들을 한 행에 정렬하기 위한 스타일
        flexDirection: 'row', // 수평 정렬
        alignItems: 'center', // 수직 가운데
    },
});

export default AnalysisCard;