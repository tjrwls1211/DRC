import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import BaseCard from './BaseCard';

// Card 컴포넌트 정의
const Card = ({ analysis_item, analysis_count, iconSource, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <BaseCard style={styles.baseCard}> 
                <View style={styles.container}>
                    <View style={styles.iconContainer}>
                        <Image source={iconSource} style={styles.icon} />
                    </View>
                    <Text style={styles.analysis_item}>{analysis_item}</Text>
                    <View style={styles.countContainer}>
                        <Text style={styles.analysis_count}>{analysis_count}</Text>
                        <Text style={styles.arrow}>{'>'}</Text>
                    </View>
                </View>
            </BaseCard>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    baseCard: {
        backgroundColor: '#fff', // 카드 배경색을 회색으로 설정
        borderRadius: 13, // 모서리 둥글게
        padding: 10, // 내부 여백
        elevation: 2, // 그림자 효과 (안드로이드)
        shadowColor: '#000', // 그림자 색상 (iOS)
        shadowOffset: { width: 0, height: 2 }, // 그림자 오프셋
        shadowOpacity: 0.3, // 그림자 투명도
        shadowRadius: 4, // 그림자 반경
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    iconContainer: { //아이콘 배경 원
        width: 50,
        height: 50,
        borderRadius: 30,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: -4,
        marginLeft: 0,
        borderWidth:2,
        borderColor: 'rgba(0, 150, 136, 1)'
        
    },
    icon: {
        width: 32,
        height: 32,
    },
    analysis_item: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    countContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    analysis_count: {
        fontSize: 23,
        fontWeight: 'bold',
    },
    arrow: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 2,
    },
});

export default Card;
