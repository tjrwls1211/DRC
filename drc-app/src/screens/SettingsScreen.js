import React from 'react';
import { View, Text, Button, Switch, StyleSheet } from 'react-native';
import {useNavigation} from '@react-navigation/native';

const SettingsScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>설정</Text>

      <Text style={styles.label}>계정</Text>
      <Button title="개인정보" onPress={() => navigation.navigate('PersonalInfoScreen') } />
      <Button title="닉네임 수정" />
      <Button title="비밀번호 수정" />

      <Text style={styles.label}>앱 설정</Text>
      <View style={styles.darkModeContainer}>
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>다크모드</Text>
        <Switch value={false}/>
      </View>

      <View style={styles.buttonContainer}>
        <Button title = "로그아웃" color="gray"/>
        <Button title = "회원탈퇴" color="gray"/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end', // 화면 하단 정렬
    padding: 16,
    // flexDirection: 'row', // 가로 방향으로 배치
    // justifyContent: 'center',
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
  darkModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
});

export default SettingsScreen;
