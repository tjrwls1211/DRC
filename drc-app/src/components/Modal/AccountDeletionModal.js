import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { verifyPassword, deleteUserAccount } from '../../api/accountAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccountDeletionModal = ({ visible, onClose }) => {
  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');

  // 비밀번호 검증 함수
  const handleCheckPassword = async () => {
    try {
      //const isCorrect = await verifyPassword(password);
      const isCorrect = true; // 테스트용
      if (isCorrect) {
        setVerificationMessage("인증되었습니다.");
        setIsVerified(true);
      } else {
        setVerificationMessage("비밀번호가 틀렸습니다.");
        setIsVerified(false);
      }
    } catch (error) {
      console.error('비밀번호 검증 중 오류 발생:', error);
      setVerificationMessage("비밀번호 검증 중 오류가 발생했습니다.");
    }
  };

  // 회원 탈퇴 함수
  const handleAccountDeletion = async () => {
    if (!isVerified) {
      Alert.alert("오류", "비밀번호 인증이 필요합니다."); 
      return;
    }
    try {
      await deleteUserAccount(password);
      await AsyncStorage.removeItem('token'); // 로컬 저장소 토큰 삭제
      Alert.alert("회원 탈퇴 완료", "계정이 성공적으로 삭제되었습니다.");
      navigation.navigate('LoginScreen'); // 로그인 화면으로 이동
      onClose(); // 모달 닫기
    } catch (error) {
      console.error('회원 탈퇴 과정에서 오류 발생:', error);
      Alert.alert("회원 탈퇴 실패", "회원 탈퇴 중 오류가 발생했습니다.");
    }
  };

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modal}>
          <Text style={styles.title}>회원탈퇴</Text>
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
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleAccountDeletion} 
              style={[styles.deleteButton, !isVerified && styles.disabledButton]} 
              disabled={!isVerified}
            >
              <Text style={styles.deleteText}>탈퇴하기</Text>
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
    textAlign: 'center',
  },
  warningText: {
    color: 'red',
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  cancelText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  disabledButton: {
    backgroundColor: '#f5c6c6',
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AccountDeletionModal;
