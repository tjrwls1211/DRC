import React, { useState } from 'react';
import { TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BasicModal from './BasicModal';

const PasswordChangeModal = ({ visible, onClose, onConfirm }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');

  const verifyPassword = () => {
    // 비밀번호 검증 로직 (추후 구현)
    const isCorrect = true;  // 임시로 true로 설정
    setIsVerified(isCorrect);
    setVerificationMessage(isCorrect ? "인증되었습니다." : "비밀번호가 틀렸습니다.");
  };

  return (
    <BasicModal 
      visible={visible} 
      onClose={onClose} 
      onConfirm={() => onConfirm(newPassword)}
      title="비밀번호 변경"
    >
      <TextInput
        style={styles.input}
        placeholder="현재 비밀번호"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
      />
      <TouchableOpacity onPress={verifyPassword} style={styles.verifyButton}>
        <Text style={styles.verifyButtonText}>인증</Text>
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
          />
          <TextInput
            style={styles.input}
            placeholder="새 비밀번호 확인"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </>
      )}
    </BasicModal>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  verifyButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  verifyButtonText: {
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
