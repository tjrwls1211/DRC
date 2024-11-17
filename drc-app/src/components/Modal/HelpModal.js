import React, { useState } from 'react';
import { Modal, View, FlatList, Image, TouchableOpacity, StyleSheet, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../Mode/ThemeContext'; // ThemeContext에서 useTheme 가져오기

const HelpModal = ({ visible, images, onClose }) => {
    const { isDarkMode } = useTheme(); // 현재 테마 정보 가져오기
    const [currentIndex, setCurrentIndex] = useState(0); // 현재 이미지 인덱스 상태

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // 다음 이미지로 이동
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length); // 이전 이미지로 이동
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose} // 모달 닫기
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalContainer}
            >
                <View style={[styles.modal, { backgroundColor: isDarkMode ? '#1f1f1f' : 'white' }]}>
                    <View style={styles.imageContainer}>
                        <TouchableOpacity onPress={prevImage} style={styles.arrowButton}>
                            <Text style={styles.arrowText}>◀</Text> {/* 이전 버튼 */}
                        </TouchableOpacity>
                        <View style={styles.imageWrapper}> {/* 이미지 래퍼 추가 */}
                            <Image 
                                source={images[currentIndex]} // 현재 이미지 표시
                                style={styles.helpImage}
                            />
                        </View>
                        <TouchableOpacity onPress={nextImage} style={styles.arrowButton}>
                            <Text style={styles.arrowText}>▶</Text> {/* 다음 버튼 */}
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: isDarkMode ? '#444' : '#d5e3e2' }]}>
                        <Text style={[styles.closeText, { color: isDarkMode ? '#fff' : 'black' }]}>닫기</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modal: {
        width: '95%', // 모달 너비를 거의 꽉 차게 설정
        maxHeight: '90%', // 모달 최대 높이
        padding: 10,
        borderRadius: 10,
    },
    imageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    arrowButton: {
        padding: 10,
    },
    arrowText: {
        fontSize: 24,
        color: '#009688'
    },
    helpImage: {
        width: '100%', // 이미지 너비를 모달에 맞춤
        height: 500, // 이미지 높이를 크게 설정
        resizeMode: 'cover', // 이미지 비율 유지하면서 꽉 채우기
        borderRadius: 10,
    },
    closeButton: {
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    closeText: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
    imageWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
    },
});

export default HelpModal;
