import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BaseCard from './BaseCard';
import { useTheme } from '../Mode/ThemeContext'; // 다크 모드 Context import

const ViewCard = ({ name, score }) => {
    const { isDarkMode } = useTheme(); // 다크 모드 상태 가져오기

    const getScoreColor = (score) => {
        let red = 0;
        let green = 0;

        if (score <= 50) {
            red = 255; // 빨간색 최대
            green = Math.round((score / 50) * 128); // 초록색 비율 증가 (128로 조정)
        } else {
            red = Math.round(255 - ((score - 50) / 50) * 255); // 빨간색 비율 감소
            green = 190 + Math.round(((score - 50) / 50) * 30); // 초록색 비율 증가 (128에서 시작)
        }

        return `rgb(${red}, ${green}, 0)`; // RGB 색상 반환
    };

    return (
        <BaseCard style={[styles.customCard, { backgroundColor: isDarkMode ? '#444444' : '#ffffff' }]}>
            <Text style={[styles.name, { color: isDarkMode ? '#ffffff' : '#333' }]}>
                {name}님의 이번주 주행 점수는
            </Text>
            <Text style={[styles.score, { color: getScoreColor(score) }]}>
                {score}점
            </Text>
        </BaseCard>
    );
};

const styles = StyleSheet.create({
    customCard: {
        top: "-30%",
        height: '40%',
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#009688',
    },
    name: {
        fontSize: 20,
        textAlign: 'center',
    },
    score: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ViewCard;
