import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

// Card 컴포넌트 정의
const Card = ({title, onPress}) => {
    return(
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 20,
        marginVertical: 10, // 카드 간의 수직 간격
        borderRadius: 10, // 카드 모서리 둥글게
        shadowColor: '#000', // 그림자 색상
        shadowOffset: { width: 0, height: 2 }, // 그림자 오프셋
        shadowOpacity: 0.1, // 그림자 불투명도
        shadowRadius: 4, // 그림자 반경
        elevation: 3, // 안드로이드에서 그림자 효과를 위한 속성
    },
    title: {
        fontSize: 18,
        fontWeight:'bold',
    },
});

export default Card;