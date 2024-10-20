import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { loginUser } from '../components/api'; // api.js에서 loginUser 함수 가져오기

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // 오류 메시지 상태 추가

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("아이디(이메일)와 비밀번호를 입력해 주세요.");
      return;
    }

    try {
      const responseData = await loginUser(email, password);
      console.log('Login successful:', responseData);
      navigation.navigate("MainScreen", { screen: 'MainScreen' });
      setErrorMessage(''); // 성공 시 오류 메시지 초기화
    } catch (error) {
      // 서버에서 반환된 오류 처리
      if (error.response) {
        setErrorMessage(error.response.data.message || "아이디나 비밀번호가 틀립니다.");
      } else {
        setErrorMessage("네트워크 오류가 발생했습니다.");
      }
    }
  };

  return (
    <View style={Styles.container}>      
      <Text style={Styles.LogoText}>DRC</Text>
      <View style={Styles.LoginView}>

        <Text>ID (Email)</Text>
        <TextInput 
          style={Styles.TextInput} 
          onChangeText={setEmail}
          placeholder="ID (Email)"
          placeholderTextColor="#D9D9D9"
        />
        <Text>Password</Text>
        <TextInput 
          style={Styles.TextInput} 
          onChangeText={setPassword}
          placeholder="password"
          placeholderTextColor="#D9D9D9"
          secureTextEntry={true}
        />

        {/* 오류 메시지 표시 */}
        {errorMessage ? (
          <Text style={Styles.ErrorMessage}>{errorMessage}</Text>
        ) : null}
        
        <TouchableOpacity 
          style={Styles.LoginBtn}
          onPress={handleLogin}>
          <Text style={Styles.BtnText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={{marginTop: 20}}
          onPress={() => navigation.navigate("SignUpScreen", { screen: 'SignUpScreen' })}>
          <Text style={Styles.SignUpText}>회원가입하러가기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  LoginView: {
    flex: 1,
    padding: 20,
    margin: 35,
    marginBottom: "50%",
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#D9D9D9',
    borderRadius: 6
  },
  LogoText: {
    fontSize: 30,
    marginTop: "30%",
    textAlign: "center",
  },
  TextInput: {
    marginTop: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    height: 35,
    borderRadius: 6,
    borderColor: '#D9D9D9',
    borderWidth: 1
  },
  LoginBtn: {
    margin: 10,
    backgroundColor: "black",
    padding: 10,
    width: "100%",
    alignSelf: "center",
    borderRadius: 10
  },
  BtnText: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  SignUpText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#cccccc',
  },
  ErrorMessage: {
    color: 'red', 
    marginBottom: 10,
    textAlign: 'center', 
  }
});