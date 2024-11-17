import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../Mode/ThemeContext';

const HelpScoreModal = ({ visible, onClose }) => {
    const { isDarkMode } = useTheme();

    return (
        <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#2f4f4f' : '#fff' }]}>
                    <Text style={[styles.modalText, { color: isDarkMode ? '#fff' : '#000' }]}>
                        안전운전 점수는 최근 주행시간을 5시간 단위로 하나의 구간으로 책정한 뒤,{"\n"}
                        최대 6개 구간의 점수를 기반으로 평균을 내어 계산됩니다.{"\n\n"}
                        또한, 주행시간이 30시간이 넘을 경우 가장 과거 시점 구간이 제외되고{"\n"}
                        새로운 구간이 점수에 반영됩니다.
                    </Text>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeText}>닫기</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(0, 0, 0, 0.5)' 
    },
    modalContent: {    
        width: '80%', 
        padding: 20, 
        borderRadius: 10, 
        alignItems: 'center' 
    },
    modalText: { 
        fontSize: 16, 
        marginBottom: 20, 
        textAlign: 'center' 
    },
    closeButton: { 
        padding: 9, 
        width: '22%',
        borderRadius: 5, 
        backgroundColor: '#009688' 
    },
    closeText: { 
        color: '#fff', 
        ontWeight: 'bold',
        textAlign: 'center',
    },
});

export default HelpScoreModal;