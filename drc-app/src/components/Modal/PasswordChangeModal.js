import React, { useState } from 'react';
import { TextInput, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import BasicModal from './BasicModal';
import { verifyPassword, changePassword  } from '../../api/accountAPI';

const PasswordChangeModal = ({ visible, onClose, onConfirm }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [passwordMatchMessage, setPasswordMatchMessage] = useState('');

  const checkPassword = async () => {
    console.log("비밀번호 인증 버튼 클릭");
    try {
      const isCorrect = await verifyPassword(currentPassword);
      //const isCorrect = true; // 테스트용
      setIsVerified(isCorrect);
      setVerificationMessage(isCorrect ? "인증되었습니다" : "비밀번호가 틀렸습니다");
    } catch (error) {
      setIsVerified(false);
      setVerificationMessage("비밀번호 인증 중 오류가 발생했습니다");
    }
  };

  // 비밀번호 변경 요청 함수
  const handleConfirm = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("오류", "새 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    try {
      const response = await changePassword(newPassword);
      if (response.success) {
        Alert.alert("성공", "비밀번호가 변경되었습니다.");
        onConfirm(newPassword); // 비밀번호 변경 후 확인 콜백 호출
        onClose(); // 모달 닫기
      } else {
        Alert.alert("실패", response.message); // 서버에서 반환한 메시지 표시
      }
    } catch (error) {
      Alert.alert("오류", "비밀번호 변경 중 오류가 발생했습니다.");
    }
  };

  // 비밀번호 일치 확인
  const handlePasswordMatchCheck = () => {
    if (newPassword === confirmPassword) {
      setPasswordMatchMessage("비밀번호가 일치합니다");
    } else {
      setPasswordMatchMessage("비밀번호가 일치하지 않습니다");
    }
  };

  return (
    <BasicModal 
      visible={visible} 
      onClose={onClose} 
      onConfirm={handleConfirm}
      title="비밀번호 변경"
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
      {isVerified && (
        <>
          <TextInput
            style={styles.input}
            placeholder="새 비밀번호"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            onBlur={handlePasswordMatchCheck} // 새 비밀번호 입력 후 일치 확인
          />
          <TextInput
            style={styles.input}
            placeholder="새 비밀번호 확인"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            onBlur={handlePasswordMatchCheck} // 새 비밀번호 확인 입력 후 일치 확인
          />
          {passwordMatchMessage ? (
            <Text style={[styles.verificationText, passwordMatchMessage.includes("일치합니다") ? styles.success : styles.error]}>
              {passwordMatchMessage}
            </Text>
          ) : null}
        </>
      )}
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

export default PasswordChangeModal;