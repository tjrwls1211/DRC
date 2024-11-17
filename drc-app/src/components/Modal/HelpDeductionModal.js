import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../Mode/ThemeContext';

const HelpDeductionModal = ({ visible, onClose }) => {
    const { isDarkMode } = useTheme();

    return (
        <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#2f4f4f' : '#fff' }]}>
                    <Text style={[styles.modalText, { color: isDarkMode ? '#fff' : '#000' }]}>
                        도움말 내용이 여기에 표시됩니다. 주행 점수 계산 및 관련 정보에 대한 설명을 추가하세요.
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

export default HelpDeductionModal;