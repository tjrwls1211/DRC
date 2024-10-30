import React, { useState } from 'react';
import { TextInput, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BasicModal from './BasicModal';
import { checkPassword, deleteUserAccount } from '../../api/accountAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccountDeletionModal = ({ visible, onClose }) => {
  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');

  // 비밀번호 검증 함수
  const handleCheckPassword = async () => {
    try {
      const isCorrect = await checkPassword(password); // 비밀번호 검증 API 호출
      if (isCorrect) {
        setVerificationMessage("인증되었습니다.");
        setIsVerified(true); // 인증 성공 시 상태 업데이트
      } else {
        setVerificationMessage("비밀번호가 틀렸습니다.");
      }
    } catch (error) {
      console.error('비밀번호 검증 중 오류 발생:', error);
      setVerificationMessage("비밀번호 검증 중 오류가 발생했습니다.");
    }
  };

  // 회원 탈퇴 함수
  const handleAccountDeletion = async () => {
    if (!isVerified) {
      Alert.alert("오류", "비밀번호 인증이 필요합니다."); // 인증되지 않은 경우 경고
      return;
    }
    try {
      await deleteUserAccount(password); // 회원 탈퇴 API 호출
      await AsyncStorage.removeItem('token'); // 로컬 저장소의 토큰 삭제
      Alert.alert("회원 탈퇴 완료", "계정이 성공적으로 삭제되었습니다.");
      navigation.navigate('LoginScreen'); // 로그인 화면으로 이동
      onClose(); // 모달 닫기
    } catch (error) {
      console.error('회원 탈퇴 과정에서 오류 발생:', error);
      setVerificationMessage("회원 탈퇴 중 오류가 발생했습니다.");
    }
  };

  return (
    <BasicModal 
      visible={visible} 
      onClose={onClose} 
      title="회원탈퇴"
      onConfirm={handleAccountDeletion} // 확인 버튼은 탈퇴하기로 설정
      confirmText="탈퇴하기" // 확인 버튼 텍스트를 "탈퇴하기"로 설정
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
      <TouchableOpacity onPress={handleCheckPassword} style={styles.checkButton}>
        <Text style={styles.checkButtonText}>인증</Text>
      </TouchableOpacity>
      {verificationMessage ? (
        <Text style={[
          styles.verificationText, 
          verificationMessage.includes("틀렸습니다.") ? styles.error : 
          verificationMessage.includes("인증되었습니다.") ? styles.success : 
          styles.default
        ]}>
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
  checkButton: {
    backgroundColor: '#2ECC40', // 에메랄드 그린
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
  },
  success: {
    color: 'green',
  },
  error: {
    color: 'red',
  },
  default: {
    color: 'black',
  },
});

export default AccountDeletionModal;
