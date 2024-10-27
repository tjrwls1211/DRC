// 베이직 모달: 모달의 기본 레이아웃(타이틀, 취소 및 확인 버튼 등)
// 이 위에 필요 입력 필드, 텍스트 추가하여 재사용

// src/components/BasicModal.js
import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const BasicModal = ({ visible, onClose, title, children, onConfirm }) => {
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modal}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.content}>
            {children}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} style={styles.confirmButton}>
              <Text style={styles.confirmText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2F4F4F', // 다크 슬레이트 그레이
    textAlign: 'center', // 텍스트 가운데 정렬
  },
  content: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#ccc', // 기존 잘 보이지 않는 색
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5, // 버튼 간격
  },
  cancelText: {
    color: 'black', // 취소 버튼 텍스트 색상
    fontWeight: 'bold',
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: '#2F4F4F', // 다크 슬레이트 그레이
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5, // 버튼 간격
  },
  confirmText: {
    color: 'white', // 확인 버튼 텍스트 색상
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default BasicModal;
