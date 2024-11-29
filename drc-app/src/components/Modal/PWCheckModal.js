import React, { useState } from 'react';
import { TextInput, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import BasicModal from './BasicModal';
import { verifyPassword } from '../../api/accountAPI'; // 비밀번호 인증 API

const PWCheckModal = ({ visible, onClose, onConfirm }) => {
  const [currentPassword, setCurrentPassword] = useState(''); // 현재 비밀번호 상태
  const [isVerified, setIsVerified] = useState(false); // 비밀번호 인증 상태
  const [verificationMessage, setVerificationMessage] = useState(''); // 인증 메시지 상태

  // 비밀번호 인증 함수
  const checkPassword = async () => {
    console.log("비밀번호 인증 버튼 클릭");
    try {
      const isCorrect = await verifyPassword(currentPassword); // API 호출하여 비밀번호 확인
      setIsVerified(isCorrect); // 인증 상태 업데이트
      setVerificationMessage(isCorrect ? "인증되었습니다" : "비밀번호가 틀렸습니다"); // 메시지 설정
    } catch (error) {
      setIsVerified(false);
      console.log("비밀번호 인증 실패 에러", error.response.data);
      setVerificationMessage(error.response.data.message); // 에러 메시지 설정
    }
  };

  const handleClose = () => {
    // 모달 닫기 전 상태 초기화
    setCurrentPassword('');
    setIsVerified(false);
    setVerificationMessage('');
    onClose(); // 부모 컴포넌트의 모달 닫기 함수
  };

  return (
    <BasicModal 
      visible={visible} 
      onClose={handleClose} 
      onConfirm={onConfirm} // 확인 버튼 클릭 시 호출
      title="비밀번호 인증"
    >
      <TextInput
        style={styles.input}
        placeholder="현재 비밀번호"
        value={currentPassword}
        onChangeText={setCurrentPassword} // 현재 비밀번호 입력 처리
        secureTextEntry // 비밀번호 입력 시 가리기
      />
      <TouchableOpacity onPress={checkPassword} style={styles.checkButton}>
        <Text style={styles.checkButtonText}>인증</Text>
      </TouchableOpacity>
      {verificationMessage ? (
        <Text style={[styles.verificationText, isVerified ? styles.success : styles.error]}>
          {verificationMessage} // 인증 결과 메시지 표시
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
