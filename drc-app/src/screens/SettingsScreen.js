import React, {useState} from 'react';
import {View, Text, Button, Switch, StyleSheet, Alert } from 'react-native';
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
      <Button title="개인정보" onPress={() => navigation.navigate('PersonalInfoScreen') } />
      <Button title="닉네임 수정" onPress = {() => setNicknameModalVisible(true)} />
      <Button title="비밀번호 수정" onPress = {() => setPasswordModalVisible(true)} />

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

      {/* QR 코드 표시 부분 ☆ */}
      {/* 지울 예정 ☆ */}
      {qrUrl && (
        <View style={styles.qrContainer}>
          <Text style={styles.label}>QR 코드</Text>
          <QRCode value={qrUrl} size={200} /> 
        </View>
      )}

      {/* OTP 키와 QR URL을 보여주는 모달 */}
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>OTP 키</Text>
          <Text style={styles.otpKey}>{otpKey}</Text>
          <Button title="복사하기" onPress={handleCopyOtpKey} />
          <Button title="QR 확인" onPress={() => {
            Linking.openURL(qrUrl); // QR URL을 웹 브라우저에서 열기
          }} />
          <Button title="닫기" onPress={closeModal} />
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
  },
  darkModeContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginVertical: 20,
    height: "40%",
    //backgroundColor: "black",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center', // 화면 하단 정렬
    padding: 16,
    flexDirection: 'row', // 수평 정렬
    alignItems: 'center', // 수직 가운데
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBootm: 5,
    color: 'gray',
  },
  dropdown: {
    marginVertical: 10,
    borderColor: 'gray',
  },
  dropdownContainer: {
    borderColor: 'gray',
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
});

export default SettingsScreen;