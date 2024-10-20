import React, {useState} from 'react';
import {View, Text, Button, Switch, StyleSheet } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import NicknameChangeModal from '../components/Modal/NicknameChangeModal.js';
import PasswordChangeModal from '../components/Modal/PasswordChangeModal.js';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [nicknameModalVisible, setNicknameModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>설정</Text>

      <Text style={styles.label}>계정</Text>
      <Button title="개인정보" onPress={() => navigation.navigate('PersonalInfoScreen') } />
      <Button title="닉네임 수정" onPress = {() => setNicknameModalVisible(true)} />
      <Button title="비밀번호 수정" onPress = {() => setPasswordModalVisible(true)} />

      <Text style={styles.label}>앱 설정</Text>
      <View style={styles.darkModeContainer}>
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>다크모드</Text>
        <Switch value={false}/>
      </View>

      <View style={styles.buttonContainer}>
        <Button title = "로그아웃" color="gray"/>
        <Button title = "회원탈퇴" color="gray"/>
      </View>

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
    height: "60%",
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
});

export default SettingsScreen;
