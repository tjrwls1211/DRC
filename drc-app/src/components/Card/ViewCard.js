import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BaseCard from './BaseCard';

const ViewCard = ({ name, score }) => {
    const getScoreColor = (score) => {
        let red = 0;
        let green = 0;

        if (score <= 50) {
            // 0~50: 빨간색에서 주황색으로
            red = 255; // 빨간색 최대
            green = Math.round((score / 50) * 128); // 초록색 비율 증가 (128로 조정)
        } else {
            // 51~100: 주황색에서 초록색으로
            red = Math.round(255 - ((score - 50) / 50) * 255); // 빨간색 비율 감소
            green = 190 + Math.round(((score - 50) / 50) * 30); // 초록색 비율 증가 (128에서 시작)
        }

        return `rgb(${red}, ${green}, 0)`; // RGB 색상 반환
    };

    return (
        <BaseCard style={styles.customCard}>
            <Text style={styles.name}>{name}님의 이번주 주행 점수는</Text>
            <Text style={[styles.score, { color: getScoreColor(score) }]}>{score}점</Text>
        </BaseCard>
    );
};

const styles = StyleSheet.create({
    customCard: {
        height: '30%',
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    name: {
        fontSize: 20,
        color: '#333',
        textAlign: 'center',
    },
    score: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ViewCard;
