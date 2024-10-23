import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { loginUser, checkTokenValidity } from '../api/authAPI'; // api.js에서 loginUser 함수 가져오기

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // 오류 메시지 상태 추가

  // 앱 시작 시 토큰 유효성 검사
  useEffect(() => {
    const checkToken = async () => {
      const isValid = await checkTokenValidity();
      if (isValid) {
        navigation.navigate('MainScreen');
      } else {
        console.log("토큰 검증 중 오류(아마 API 연결안됨)");
      }
    };
    checkToken();
  }, []);

  // 로그인 처리 핸들러
  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("아이디(이메일)와 비밀번호를 입력해 주세요.");
      return;
    }

    try {
      // liginUser 함수로 서버에 로그인 요청 후 응답 대기
      const success = await loginUser(email, password);
      if (success) {
        console.log('로그인 성공');
        setErrorMessage('');
        navigation.navigate("MainScreen", {screen: 'MainScreen'}); // 로그인 성공 시 메인화면 이동
      } else {
        setErrorMessage('아이디나 비밀번호가 틀렸습니다. 다시 입력해 주세요.')
      }
    } catch (error) {
        if (error.response && error.response.data) {
          // 서버에서 받은 로그인 실패 이유 오류 메시지 화면에 출력
          setErrorMessage(error.response.data);
        } else {
          setErrorMessage('로그인 처리 중 오류가 발생했습니다.');
          console.error('로그인 오류:', error);
        }
    }
  };

  return (
    <View style={Styles.container}>      
      <Text style={Styles.LogoText}>DRC</Text>

      <View style={Styles.LoginView}>
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={100}
          >
          <ScrollView contentContainerStyle={Styles.scrollContent}>
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
          </ScrollView>
        </KeyboardAvoidingView>
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
    borderRadius: 6,
  },
  scrollContent: {
    flexGrow: 1, // 스크롤뷰 내용이 밀릴 수 있도록 설정
    justifyContent: 'center',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
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