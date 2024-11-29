import React, { useState } from 'react';
import { TextInput, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import BasicModal from './BasicModal'; // 공통 모달 컴포넌트 (가정)
import { verifyPassword } from '../../api/accountAPI'; // 비밀번호 인증 API (현재 비활성화)

const PWCheckModal = ({ visible, onClose, onConfirm }) => {
  const [currentPassword, setCurrentPassword] = useState(''); // 현재 비밀번호 상태
  const [isVerified, setIsVerified] = useState(false); // 비밀번호 인증 상태
  const [verificationMessage, setVerificationMessage] = useState(''); // 인증 메시지 상태

  // 비밀번호 인증 함수
  const checkPassword = async () => {
    console.log("비밀번호 인증 버튼 클릭");

    // 서버 테스트가 안되므로 인증 성공 상태로 바로 처리
    setIsVerified(true); // 인증 상태를 성공으로 설정
    setVerificationMessage("인증되었습니다."); // 인증 성공 메시지
    console.log("onConfirm 호출"); // 디버깅용 로그
    onConfirm(); // 인증 성공 시 부모 컴포넌트에 알림
  };

  const handleClose = () => {
    setCurrentPassword(''); // 상태 초기화
    setIsVerified(false);
    setVerificationMessage('');
    onClose(); // 부모 컴포넌트의 모달 닫기 함수 호출
  };

  return (
    <BasicModal
      visible={visible}
      onClose={handleClose}
      title="비밀번호 인증"
    >
      <TextInput
        style={styles.input}
        placeholder="현재 비밀번호"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
      />
      <TouchableOpacity onPress={checkPassword} style={styles.checkButton}>
        <Text style={styles.checkButtonText}>인증</Text>
      </TouchableOpacity>
      {verificationMessage ? (
        <Text style={[styles.verificationText, isVerified ? styles.success : styles.error]}>
          {verificationMessage}
        </Text>
      ) : null}
    </BasicModal>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#009688',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    fontSize: 16,
  },
  checkButton: {
    backgroundColor: '#009688',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  checkButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  verificationText: {
    marginBottom: 10,
    fontWeight: 'bold',
  },
  success: {
    color: 'green',
  },
  error: {
    color: 'red',
  },
});

export default PWCheckModal;
