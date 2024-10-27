// src/components/AccountDeletionModal.js
import React, { useState } from 'react';
import { TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BasicModal from './BasicModal';

const AccountDeletionModal = ({ visible, onClose, onConfirm }) => {
  const [password, setPassword] = useState('');
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
      onConfirm={onConfirm}
      title="회원탈퇴"
    >
      <Text style={styles.warningText}>
        탈퇴 시, 계정은 삭제되며 복구되지 않습니다.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
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
    </BasicModal>
  );
};

const styles = StyleSheet.create({
    warningText: {
      color: 'red',
      marginBottom: 20,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    input: {
      borderWidth: 1,
      borderColor: '#2ECC40', // 에메랄드 그린
      padding: 10,
      marginBottom: 15,
      borderRadius: 5,
      fontSize: 16,
    },
    verifyButton: {
      backgroundColor: '#2ECC40', // 에메랄드 그린
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
  
  export default AccountDeletionModal;
