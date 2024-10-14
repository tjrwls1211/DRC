import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import BaseCard from './BaseCard';

const ViewCard = ({name, score}) => {
    return (
        <BaseCard style={styles.customCard}>
            <Text style={styles.name}>{name}님의 이번주 주행 점수는</Text>
            <Text style={styles.score}>{score}점</Text>
        </BaseCard>
    );
};

const styles = StyleSheet.create({
    customCard: {
        height: '35%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    name: {
        fontSize: 22,
        color: '#333',
        textAlign: 'center',
    },
    score: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#E74C3C',
        textAlign: 'center',
    },
});

export default ViewCard;