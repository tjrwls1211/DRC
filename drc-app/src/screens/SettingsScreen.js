import React, { useState, useEffect } from 'react';
import { View, Text, Button, Switch, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker'; // DropDownPicker 가져오기
import { enableTwoFactorAuth, disableTwoFactorAuth } from '../api/authAPI'; // 2FA 관련 서버 통신 함수 가져오기
import { useNavigation } from '@react-navigation/native';
import NicknameChangeModal from '../components/Modal/NicknameChangeModal.js';
import PasswordChangeModal from '../components/Modal/PasswordChangeModal.js';
import AccountDeletionModal from '../components/Modal/AccountDeletionModal.js';
import LogoutModal from '../components/Modal/LogoutModal.js';
import { useTwoFA } from '../context/TwoFAprovider.js'; // 2차인증 필요 상태 Context import
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import * as Clipboard from 'expo-clipboard'; // 클립보드 작업을 위한 라이브러리
import { Linking } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../components/Mode/ThemeContext.js'; // 다크 모드 Context import

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { isDarkMode, setIsDarkMode } = useTheme(); // 다크 모드 상태 가져오기
  const [nicknameModalVisible, setNicknameModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [qrUrl, setQrUrl] = useState(null); // QR URL 상태
  const [otpKey, setOtpKey] = useState(null); // otpKey 상태
  const [isModalVisible, setModalVisible] = useState(false); // 모달 상태
  
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: '비활성', value: false }, 
    { label: '활성', value: true }, 
  ]);
  const { is2FAEnabled, setIs2FAEnabled } = useTwoFA();
  console.log("2차인증 상태 확인: ", is2FAEnabled);

  // 2차 인증 드롭다운 기본값 로컬 저장소에서 가져오기
  useEffect(() => {
    const loadTwoFASetting = async () => {
        const storedStatus = await AsyncStorage.getItem('is2FAEnabled');
        const status = storedStatus === 'true';
        setIs2FAEnabled(status);
        setOpen(false);
    };

    loadTwoFASetting();
  }, []);

  // 2차 인증 활성화/비활성 상태 변경 핸들러
  const handle2FAChange = async (value) => {
    if (value) {
        console.log("2차인증 활성");
        const { qrUrl, otpKey } = await enableTwoFactorAuth();
        setQrUrl(qrUrl);
        setOtpKey(otpKey);
        setModalVisible(true);
        Alert.alert("OTP 인증 정보가 생성되었습니다.", "QR 코드를 스캔하거나 설정 key를 사용하여 OTP 코드를 생성하세요.");
    } else {
        console.log("2차인증 비활성");
        try {
            const response = await disableTwoFactorAuth();
            setQrUrl(null);
            setOtpKey(null);

            if (response.success) {
                Alert.alert("성공", response.message);
            }
        } catch (error) {
            console.error("2차 인증 비활성화 오류:", error);
            Alert.alert("오류", "2차 인증 비활성화 중 문제가 발생했습니다.");
        }
    }
    setIs2FAEnabled(value);
    console.log("2차인증 전역상태 업데이트: ", value);
  };

  // 드롭다운에서 선택된 값에 따라 상태 업데이트
  useEffect(() => {
    if (is2FAEnabled) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [is2FAEnabled]);

  // 모달 닫기 함수
  const closeModal = () => {
    setNicknameModalVisible(false);
    setPasswordModalVisible(false);
    setDeleteModalVisible(false);
    setLogoutModalVisible(false);
    setModalVisible(false);
  };

  const handleNicknameChange = () => {
    setNicknameModalVisible(false);
  }

  const handlePasswordChange = (newPassword) => {
    console.log('New password:', newPassword);
    setPasswordModalVisible(false);
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

  const toggleSwitch = () => {
    setIsDarkMode(previousState => !previousState); // 다크 모드 상태를 토글
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#ffffff' }]}> 
      
  
      <View style={styles.section}>
        <FontAwesome name="user-circle" size={24} color={isDarkMode ? '#ffffff' : '#009688'} />
        <Text style={[styles.label, styles.labelSpacing, { color: isDarkMode ? '#ffffff' : '#2F4F4F' }]}>계정</Text> 
      </View>
  
      <TouchableOpacity 
        style={[styles.button, { marginTop: 5, backgroundColor: isDarkMode ? '#1f1f1f' : '#009688' }]} 
        onPress={() => navigation.navigate('PersonalInfoScreen')} 
      >
      <Text style={styles.buttonText}>개인정보</Text>
      </TouchableOpacity>

      <TouchableOpacity 
  style={[styles.button, { marginTop: 5, backgroundColor: isDarkMode ? '#1f1f1f' : '#009688' }]} 
  onPress={() => setNicknameModalVisible(true)} // 모달을 열도록 수정
>
  <Text style={styles.buttonText}>닉네임 수정</Text>
</TouchableOpacity>

<TouchableOpacity 
  style={[styles.button, { marginTop: 5, backgroundColor: isDarkMode ? '#1f1f1f' : '#009688' }]} 
  onPress={() => setPasswordModalVisible(true)} // 모달을 열도록 수정
>
  <Text style={styles.buttonText}>비밀번호 수정</Text>
</TouchableOpacity>
  
<View style={[styles.section, { marginTop: 35 }]}>
    <MaterialIcons name="lock" size={24} color={isDarkMode ? '#ffffff' : '#009688'} /> 
    <Text style={[styles.label, styles.labelSpacing, { color: isDarkMode ? '#ffffff' : '#2F4F4F' }]}>2차 인증 설정</Text>
</View>
  
<DropDownPicker
    open={open}
    value={is2FAEnabled}
    items={items} 
    setOpen={setOpen} 
    setValue={setIs2FAEnabled} 
    setItems={setItems} 
    onChangeValue={handle2FAChange} 
    style={[styles.dropdown, { marginTop: 5, backgroundColor: isDarkMode ? '#1f1f1f' : '#ffffff' }]} 
    dropDownContainerStyle={[styles.dropdownContainer, { backgroundColor: isDarkMode ? '#1f1f1f' : '#ffffff' }]} // 드롭다운 컨테이너 배경색
    labelStyle={{ color: isDarkMode ? '#ffffff' : '#009688', fontSize: 18 }} 
    textStyle={{ color: isDarkMode ? '#ffffff' : '#009688', fontSize: 18 }} 
/>
  
      <Modal isVisible={isModalVisible}>
        <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#1f1f1f' : '#ffffff' }]}>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <MaterialIcons name="close" size={24} color={isDarkMode ? '#ffffff' : '#009688'} /> 
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: isDarkMode ? '#ffffff' : '#009688' }]}>2차 인증 정보</Text>
          <View style={styles.otpKeyContainer}>
            <Text style={[styles.otpKey, { color: isDarkMode ? '#ffffff' : '#555' }]}>OTP 설정 키: {otpKey}</Text>
            <TouchableOpacity onPress={handleCopyOtpKey}>
              <MaterialIcons name="content-copy" size={24} color={isDarkMode ? '#ffffff' : '#009688'} /> 
            </TouchableOpacity>
          </View>
          <Button title="QR 확인" color={isDarkMode ? '#ffffff' : '#009688'} onPress={() => Linking.openURL(qrUrl)} /> 
        </View>
      </Modal>
  
      <View style={[styles.section, { marginTop: 35 }]}>
        <MaterialIcons name="settings" size={24} color={isDarkMode ? '#ffffff' : '#009688'} /> 
        <Text style={[styles.label, styles.labelSpacing, { color: isDarkMode ? '#ffffff' : '#2F4F4F' }]}>앱 설정</Text>
      </View>
      <View style={[styles.darkModeContainer, { marginTop: 5 }]}> 
        <Text style={{ fontSize: 18, color: isDarkMode ? '#ffffff' : 'black' }}>다크모드</Text> 
        <Switch 
          value={isDarkMode}
          onValueChange={toggleSwitch}
          trackColor={{ false: '#767577', true: '#000000' }} 
        />
      </View>
  
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={styles.buttonContainer}>
          <Button 
            title="로그아웃" 
            color="gray" 
            onPress={() => setLogoutModalVisible(true)} 
          />
          <Button 
            title="회원탈퇴" 
            color="gray" 
            onPress={() => setDeleteModalVisible(true)} 
          />
        </View>
      </View>
  
      <AccountDeletionModal 
        visible={deleteModalVisible} 
        onClose={closeModal} 
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
  labelSpacing: {
    marginLeft: 10,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10, // 섹션 간 간격 통일
  },
  label: {
    fontSize: 24,
    marginLeft: 10,
    color: '#2F4F4F', // 다크 슬레이트 그레이
    fontWeight: 'bold',
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
    paddingVertical: 12, // 높이 통일
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