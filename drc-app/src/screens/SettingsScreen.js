import React, {useState} from 'react';
import {View, Text, Button, Switch, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker'; // DropDownPicker 가져오기
import { enableTwoFactorAuth, disableTwoFactorAuth } from '../api/authAPI'; // 2FA 관련 서버 통신 함수 가져오기
import {useNavigation} from '@react-navigation/native';
import NicknameChangeModal from '../components/Modal/NicknameChangeModal.js';
import PasswordChangeModal from '../components/Modal/PasswordChangeModal.js';
import AccountDeletionModal from '../components/Modal/AccountDeletionModal.js';
import LogoutModal from '../components/Modal/LogoutModal.js';
import { useTwoFA } from '../context/TwoFAprovider.js'; // 2차인증 필요 상태 Context import
import QRCode from 'react-native-qrcode-svg'; // QR 코드 생성을 위한 라이브러리 추가
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import * as Clipboard from 'expo-clipboard'; // 클립보드 작업을 위한 라이브러리
import { Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [nicknameModalVisible, setNicknameModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [qrUrl, setQrUrl] = useState(null); // QR URL 상태
  const [otpKey, setOtpKey] = useState(null); // otpKey 상태
  const [isModalVisible, setModalVisible] = useState(false); // 모달 상태

  const { is2FAEnabled, setIs2FAEnabled } = useTwoFA(); // Context에서 2차인증 필요 상태 가져오기
  const [open, setOpen] = useState(false); // DropDownPicker 열림/닫힘 상태
  const [items, setItems] = useState([
    { label: '비활성', value: false }, 
    { label: '활성', value: true }, 
  ]);

  // 2차 인증 활성화/비활성 상태 변경 핸들러
  const handle2FAChange = async (value) => {
    if (value) {
      console.log("2차인증 활성");
      const { qrUrl, otpKey } = await enableTwoFactorAuth(); // 2차 인증 활성화 함수 호출 (QR URL 요청)
      setQrUrl(qrUrl); // QR URL을 상태에 저장
      setOtpKey(otpKey); 
      setModalVisible(true); // 모달을 열도록 설정
      Alert.alert("QR 코드가 생성되었습니다.", "QR 코드를 스캔하여 OTP를 설정하세요."); // 알림 표시
    } else {
      console.log("2차인증 비활성");
      await disableTwoFactorAuth(); // 비활성화 함수 호출
      setQrUrl(null);
      setOtpKey(null);
    }
    setIs2FAEnabled(value); // Context를 통해 2차 인증 상태 업데이트
    console.log("2차인증 전역상태 업데이트: ", is2FAEnabled);
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setNicknameModalVisible(false);
    setPasswordModalVisible(false);
    setDeleteModalVisible(false);
    setLogoutModalVisible(false);
    setModalVisible(false);
  };

  const handleNicknameChange = (newNickname) => {
    console.log('New nickname: ', newNickname);
    setNicknameModalVisible(false);
    // 닉네임 변경 로직 추가 - 추후 구현
  }

  const handlePasswordChange = (newPassword) => {
    console.log('New password:', newPassword);
    setPasswordModalVisible(false);
    // 비밀번호 변경 로직 - 추후 구현
  };

  const handleLogout = async () => {
    try {
      // AsyncStorage에서 토큰 삭제
      await AsyncStorage.removeItem('token'); 
      console.log('로그아웃 처리 완료');
      Alert.alert("로그아웃", "정상적으로 로그아웃되었습니다."); // 로그아웃 완료 메시지
      navigation.navigate('LoginScreen'); // 로그인 화면으로 리디렉션
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
      Alert.alert("오류", "로그아웃 중 문제가 발생했습니다.");
    } finally {
      setLogoutModalVisible(false); // 로그아웃 모달 닫기
    }
  };

  const handleCopyOtpKey = () => {
    if (otpKey) {
      Clipboard.setString(otpKey); // otpKey 클립보드에 복사
      Alert.alert("복사 완료", "OTP 키가 클립보드에 복사되었습니다."); // 복사 완료 알림
    } else {
      Alert.alert("오류", "OTP 키가 없습니다."); // otpKey가 없을 경우
    }
  }; 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>설정</Text>

      <Text style={styles.label}>계정</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PersonalInfoScreen')}>
        <Text style={styles.buttonText}>개인정보</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => setNicknameModalVisible(true)}>
        <Text style={styles.buttonText}>닉네임 수정</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => setPasswordModalVisible(true)}>
        <Text style={styles.buttonText}>비밀번호 수정</Text>
      </TouchableOpacity>

      {/* 2차 인증 드롭다운 */}
      <Text style={styles.label}>2차 인증 설정</Text>
      <DropDownPicker
        open={open}
        value={is2FAEnabled}
        items={items} 
        setOpen={setOpen} 
        setValue={setIs2FAEnabled} 
        setItems={setItems} 
        onChangeValue={handle2FAChange} 
        style={styles.dropdown} 
        dropDownContainerStyle={styles.dropdownContainer}
      />

      {/* OTP 키와 QR URL을 보여주는 모달 */}
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <MaterialIcons name="close" size={24} color="#009688" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>2차 인증 정보</Text>
          <View style={styles.otpKeyContainer}>
            <Text style={styles.otpKey}>OTP 키: {otpKey}</Text>
            <TouchableOpacity onPress={handleCopyOtpKey}>
              <MaterialIcons name="content-copy" size={24} color="#009688" />
            </TouchableOpacity>
          </View>
          <Button title="QR 확인" color="#009688" onPress={() => Linking.openURL(qrUrl)} />
        </View>
      </Modal>


      <Text style={styles.label}>앱 설정</Text>
      <View style={styles.darkModeContainer}>
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>다크모드</Text>
        <Switch value={false}/>
      </View>

      <View style={styles.buttonContainer}>
        <Button 
          title="로그아웃" 
          color="gray" 
          onPress={() => setLogoutModalVisible(true)} // 로그아웃 모달 표시
        />
        <Button 
          title="회원탈퇴" 
          color="gray" 
          onPress={() => setDeleteModalVisible(true)} // 회원탈퇴 모달 표시
        />
      </View>

      <AccountDeletionModal 
        visible={deleteModalVisible} 
        onClose={closeModal} // 모달 닫기
      />

      <NicknameChangeModal
        visible={nicknameModalVisible}
        onClose={() => setNicknameModalVisible(false)}
        onConfirm={handleNicknameChange}
        currentNickname="현재 닉네임"
      />
      <PasswordChangeModal 
        visible={passwordModalVisible} 
        onClose={() => setPasswordModalVisible(false)} 
        onConfirm={handlePasswordChange}
      />
      <LogoutModal 
        visible={logoutModalVisible} 
        onClose={() => setLogoutModalVisible(false)} 
        onConfirm={handleLogout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#009688',
    textAlign: 'center',
  },
  label: {
    fontSize: 20,
    marginBottom: 5,
    color: '#2F4F4F', // 다크 슬레이트 그레이
  },
  dropdown: {
    marginVertical: 10,
    borderColor: '#009688',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  dropdownContainer: {
    borderColor: '#009688',
  },
  darkModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#009688', // 기본색 청록
  },
  buttonContainer: {
    justifyContent: 'center',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#009688',
  },
  otpKeyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  otpKey: {
    fontSize: 16,
    marginVertical: 10,
    color: '#555',
    padding: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  button: {
    backgroundColor: '#009688', // 기본색 청록
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    width: '100%',
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 18,
  },
});


export default SettingsScreen;