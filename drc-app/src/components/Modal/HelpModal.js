import React, { useState } from 'react';
import { Modal, View, Image, TouchableOpacity, StyleSheet, Text, KeyboardAvoidingView, Platform } from 'react-native';
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
                        {/* Page Number */}
                        <Text style={[styles.pageNumberText, { color: isDarkMode ? '#fff' : '#000' }]}>
                            {currentIndex + 1} / {images.length}
                        </Text>
                        
                        <View style={styles.imageWrapper}>
                            <Image 
                                source={images[currentIndex]} // 현재 이미지 표시
                                style={styles.helpImage}
                            />
                        </View>
                    </View>
                    {/* Arrow Buttons and Close Button */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={prevImage} style={styles.arrowButton}>
                            <Text style={styles.arrowText}>◀</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.closeButton, { backgroundColor: isDarkMode ? '#444' : '#009688' }]} onPress={onClose}>
                            <Text style={[styles.closeText, { color: isDarkMode ? '#fff' : '#000' }]}>닫기</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={nextImage} style={styles.arrowButton}>
                            <Text style={styles.arrowText}>▶</Text>
                        </TouchableOpacity>
                    </View>
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
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '99%',
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
        marginHorizontal: 10,
        marginTop: 15,
    },
    arrowText: {
        fontSize: 34,
        color: '#009688',
    },
    helpImage: {
        width: '105%', // 이미지 너비를 모달에 맞춤
        height: 510, // 이미지 높이를 크게 설정
        marginTop: 45,
        resizeMode: 'cover', // 이미지 비율 유지하면서 꽉 채우기
        borderRadius: 10,
    },
    closeButton: {
        padding: 9,
        marginTop: 15,
        borderRadius: 5,
        width: "65%",
        height: 40,
        marginHorizontal: 5,
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
    pageNumberText: {
        position: 'absolute',
        top: 10,
        justifyContent: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default HelpModal;
