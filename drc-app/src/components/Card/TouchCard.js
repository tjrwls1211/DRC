import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import BaseCard from './BaseCard';
import { useTheme } from '../Mode/ThemeContext'; // 다크 모드 Context import

// Card 컴포넌트 정의
const Card = ({ analysis_item, analysis_count, iconSource, onPress }) => {
    const { isDarkMode } = useTheme(); // 다크 모드 상태 가져오기

    return (
        <TouchableOpacity onPress={onPress}>
            <BaseCard style={[styles.baseCard, { backgroundColor: isDarkMode ? '#444444' : '#fff'}]}> 
                <View style={styles.container}>
                    <View style={[
                        styles.iconContainer, 
                        { 
                            borderColor: isDarkMode ? '#fff' : 'rgba(0, 150, 136, 1)', 
                            backgroundColor: isDarkMode ? '#d3d3d3' : '#fff' // 다크 모드일 때 배경색 하얀색
                        }
                    ]}>
                        <Image source={iconSource} style={styles.icon} />
                    </View>
                    <Text style={[styles.analysis_item, { color: isDarkMode ? '#ffffff' : '#000' }]}>
                        {analysis_item}
                    </Text>
                    <View style={styles.countContainer}>
                        <Text style={[styles.analysis_count, { color: isDarkMode ? '#ffffff' : '#000' }]}>
                            {analysis_count}
                        </Text>
                        <Text style={[styles.arrow, { color: isDarkMode ? '#ffffff' : '#A3A3A3' }]}>
                            {'>'}
                        </Text>
                    </View>
                </View>
            </BaseCard>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    baseCard: {
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
    iconContainer: { // 아이콘 배경 원
        width: 50,
        height: 50,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: -4,
        marginLeft: 0,
    },
    icon: {
        width: 32,
        height: 32,
    },
    analysis_item: {
        fontSize: 18,
        fontWeight: 'bold',
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
