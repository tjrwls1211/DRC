import React from 'react';
import {View, StyleSheet} from 'react-native';

// 다른 카드 컴포넌트의 부모로 사용될 Card UI 기본 구조
const BaseCard = ({ children, style }) => {
    return (
        <View style = {[styles.card, style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 20,
        marginVertical: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
});

export default BaseCard;