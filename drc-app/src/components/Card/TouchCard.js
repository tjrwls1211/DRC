import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import BaseCard from './BaseCard';

// Card 컴포넌트 정의
const Card = ({analysis_item, onPress}) => {
    return(
        <TouchableOpacity onPress={onPress}>
            <BaseCard>
                <Text style={styles.analysis_item}>{analysis_item}</Text>
            </BaseCard>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    analysis_item: {
        fontSize: 18,
        fontWeight:'bold',
    },
});

export default Card;