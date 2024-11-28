import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BaseCard from './BaseCard';
import { useTheme } from '../Mode/ThemeContext'; // 다크 모드 Context import
import HelpScoreModal from "../../components/Modal/HelpScoreModal";

const ViewCard = ({ name, score }) => {
    const { isDarkMode } = useTheme(); // 다크 모드 상태 가져오기
    const [helpScoreVisible, setHelpScoreVisible] = useState(false); // 모달 표시 상태

    const openHelpScoreModal = () => setHelpScoreVisible(true); // 모달 열기 함수

    const getScoreColor = (score) => {
        return `#009688`; // RGB 색상 반환
    };

    return (
        <View>
            <TouchableOpacity 
                style={[styles.customCard, { backgroundColor: isDarkMode ? '#444444' : '#ffffff',borderRadius:15,borderColor: isDarkMode ? '#444444' : '#ffffff', }]}
                activeOpacity={0.96}
                onPress={openHelpScoreModal}
            >
                <Text style={[styles.name, { color: isDarkMode ? '#ffffff' : '#333' }]}>
                    <Text style={styles.boldName}></Text>이번주 주행 점수
                </Text>
                <View style={{ marginVertical: 3 }}></View>
                <Text style={[styles.score, { color: getScoreColor(score) }]}>
                    {score}점
                </Text>
            </TouchableOpacity>

            {/* HelpScoreModal 컴포넌트 추가 */}
            <HelpScoreModal 
                visible={helpScoreVisible} 
                onClose={() => setHelpScoreVisible(false)} // 모달 닫기 함수
            />
        </View>
    );
};

const styles = StyleSheet.create({
    customCard: {
        top: "-40%",
        height: '65%',
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
        borderColor: '#fff',
    },
    name: {
        fontSize: 25,
        textAlign: 'center',
    },
    boldName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    score: {
        fontSize: 45,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ViewCard;
