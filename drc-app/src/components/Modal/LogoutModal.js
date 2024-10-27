// src/components/LogoutModal.js
import React from 'react'; // React 라이브러리 가져오기
import { Text, StyleSheet } from 'react-native'; // React Native의 Text 및 StyleSheet 컴포넌트 가져오기
import BasicModal from './BasicModal'; // 기본 모달 컴포넌트 가져오기

// LogoutModal 컴포넌트 정의
const LogoutModal = ({ visible, onClose, onConfirm }) => {
  return (
    <BasicModal 
      visible={visible} // 모달의 열기/닫기 상태 props로 전달
      onClose={onClose} // 모달을 닫기 핸들러
      onConfirm={onConfirm} // 로그아웃 확인 핸들러
      title="로그아웃"
    >

      <Text style={styles.message}>로그아웃하시겠습니까?</Text>
    </BasicModal>
  );
};

export default LogoutModal;

const styles = StyleSheet.create({
    message: {
    fontSize: 18, // 글씨 크기 설정
    textAlign: 'center', // 텍스트 중앙 정렬
    marginVertical: 20, // 위아래 여백 설정
    color: '#2F4F4F', // 다크 슬레이트 그레이
    },
});