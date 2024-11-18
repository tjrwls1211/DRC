import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../Mode/ThemeContext';

const HelpScoreModal = ({ visible, onClose }) => {
    const { isDarkMode } = useTheme();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const images = [
        require('../../../assets/helpScore/HelpScore1.png'), // Replace with your image paths
        require('../../../assets/helpScore/HelpScore2.png'),
    ];

    const descriptions = [
        '안전운전 점수는 최근 주행시간을\n 5시간 단위로 하나의 구간으로 책정한 뒤\n 최대 6개 구간의 점수를 기반으로 \n평균을 내어 계산됩니다.\n\n',
        '또한, 주행시간이 30시간이 넘을 경우\n 가장 과거 시점 구간이 제외되고\n 새로운 구간이 점수에 반영됩니다.\n\n\n',
    ];

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    return (
        <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#2f4f4f' : '#fff' }]}>
                    
                    {/* Page Number */}
                    <Text style={[styles.pageNumberText, { color: isDarkMode ? '#fff' : '#000' }]}>
                        {currentImageIndex + 1} / {images.length}
                    </Text>

                    <Image source={images[currentImageIndex]} style={styles.image} />
                    
                    {/* Text Description */}
                    <Text style={[styles.descriptionText, { color: isDarkMode ? '#fff' : '#000' }]}>
                        {descriptions[currentImageIndex]}
                    </Text>

                    

                    {/* Arrow Buttons and Close Button */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={prevImage} style={styles.arrowButton}>
                            <Text style={styles.arrowText}>◀</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Text style={styles.closeText}>닫기</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={nextImage} style={styles.arrowButton}>
                            <Text style={styles.arrowText}>▶</Text>
                        </TouchableOpacity>
                    </View>
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '95%',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    image: {
        width: 320,
        height: 200,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    descriptionText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    arrowButton: {
        padding: 10,
    },
    arrowText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#009688',
    },
    closeButton: {
        padding: 9,
        borderRadius: 5,
        marginTop: 5,
        width: "65%",
        height: 40,
        backgroundColor: '#009688',
        marginHorizontal: 5,
    },
    closeText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    pageNumberText: {
        position: 'absolute',
        top: 10,
        right: 20,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default HelpScoreModal;