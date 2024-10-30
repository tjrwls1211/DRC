import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { loginUser, checkTokenValidity, checkOTP } from '../api/authAPI'; // api.js에서 loginUser 함수 가져오기
import { useTwoFA } from '../context/TwoFAprovider.js'; // 2차 인증 필요 상태 Context import
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // 오류 메시지
  
  const { is2FAEnabled } = useTwoFA(); // Context에서 2차 인증 상태 가져오기
  const [otp, setOtp] = useState(Array(6).fill('')); // 6자리 OTP 입력 상태
  const [is2FARequired, setIs2FARequired] = useState(false); // 2차 인증 필요 여부

  const otpRefs = useRef(Array(6).fill(null)); // 6자리 OTP 입력 필드에 대한 ref 배열

  // 앱 재접속 시 JWT 유효성 검사 후 자동 로그인 처리
  useEffect(() => {
    const checkAutoLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        
        // 토큰이 없을 경우
        if (!token) {
          console.log("토큰이 없습니다. 로그인 화면으로 이동합니다.");
          navigation.navigate("LoginScreen");
          return;
        }

        // 토큰이 있을 경우 유효성 검사
        const response = await checkTokenValidity(token);
        if (response.valid) { // valid 값을 체크
          console.log("토큰이 유효합니다. 메인 화면으로 이동합니다.");
          navigation.navigate("MainScreen");
        } else {
          console.log("토큰이 유효하지 않습니다. 로그인 화면으로 이동합니다.");
          navigation.navigate("LoginScreen");
        }
      } catch (error) {
        console.error("자동 로그인 중 오류:", error);
        Alert.alert("오류", "자동 로그인 중 문제가 발생했습니다.");
        navigation.navigate("LoginScreen");
      }
    };

    checkAutoLogin();
  }, []);

  

  // // (테스트 코드) 토큰을 사용하여 차량 정보 조회
  // useEffect(() => {
  //   const fetchCarData = async () => {
  //     try {
  //       // AsyncStorage에서 토큰 가져오기
  //       const token = await AsyncStorage.getItem('token');
        
  //       if (token) {
  //         // 차량 정보 조회 API 호출
  //         const response = await axios.get('http:/비밀/api/pedalLog/sel/CAR789', {
  //           headers: {
  //             Authorization: `Bearer ${token}`, // Bearer 토큰 방식으로 헤더 설정
  //           },
  //         });
          
  //         console.log('차량 정보:', response.data);
  //       } else {
  //         console.log('토큰이 없습니다.');
  //       }
  //     } catch (error) {
  //       console.error('차량 정보 조회 오류:', error);
  //     }
  //   };

  //   fetchCarData(); // 컴포넌트가 마운트될 때 차량 정보 조회 실행
  // }, []);

  // 로그인 처리 핸들러(2차인증 관련 수정 전)
  // const handleLogin = async () => {
  //   if (!email || !password) {
  //     setErrorMessage("아이디(이메일)와 비밀번호를 입력해 주세요.");
  //     return;
  //   }

  //   try {
  //     // liginUser 함수로 서버에 로그인 요청 후 응답 대기
  //     const success = await loginUser(email, password);
  //     if (success) {
  //       console.log('로그인 성공');
  //       setErrorMessage('');
  //       navigation.navigate("MainScreen", {screen: 'MainScreen'}); // 로그인 성공 시 메인화면 이동
  //     } else {
  //       setErrorMessage('아이디나 비밀번호가 틀렸습니다. 다시 입력해 주세요.')
  //     }
  //   } catch (error) {
  //       if (error.response && error.response.data) {
  //         // 서버에서 받은 로그인 실패 이유 오류 메시지 화면에 출력
  //         setErrorMessage(error.response.data);
  //       } else {
  //         setErrorMessage('로그인 처리 중 오류가 발생했습니다.');
  //         console.error('로그인 오류:', error);
  //       }
  //   }
  // };

  // 로그인 처리 핸들러
  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("아이디(이메일)와 비밀번호를 입력해 주세요.");
      return;
    }

    try {
      const response = await loginUser(email, password);
      if (response.loginStatus === 1) {
        // 2차 인증이 필요한 경우
        setIs2FARequired(true);
        Alert.alert("2차 인증 필요", "OTP 코드를 입력하세요.");
      } else if (response.token) {
          // 2차 인증 비활성 경우 그냥 로그인 처리
          console.log('로그인 성공');
          setErrorMessage('');
          // JWT 토큰이 반환된 경우
          await AsyncStorage.setItem('token', response.token);
          navigation.navigate("MainScreen", { screen: 'MainScreen' }); // 메인화면 이동
        } else {
          setErrorMessage('로그인 실패: ' + response.message); // 로그인 실패 시 메시지
      }
    } catch (error) {
      setErrorMessage('로그인 처리 중 오류가 발생했습니다.');
      console.error('로그인 오류:', error);
    }
  };

  const handleOTPChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text.replace(/[^0-9]/g, ''); // 숫자만 허용
    setOtp(newOtp);

    // 다음 입력 필드로 포커스 이동
    if (text && index < 5) {
      otpRefs.current[index + 1].focus(); // ref를 사용하여 포커스 이동
    }
  };

  // OTP 검증 핸들러
  const handleOTPVerification = async () => {
    const otpCode = otp.join(''); // 6자리 OTP 코드 결합
    try {
        const isVerified = await checkOTP(email, otpCode);
        if (isVerified) {
            Alert.alert("OTP 확인 성공", "메인 화면으로 이동합니다.");
            // OTP 검증 후 받은 토큰을 AsyncStorage에 저장
            const response = await checkOTP(email, otpCode);
            console.log("(LoginScreen.js 2차인증 반환 데이터: ", response);
            if (response) {
                navigation.navigate("MainScreen", {screen: 'MainScreen'}); // 메인 화면으로 이동
            } else {
                Alert.alert("오류", "토큰을 받을 수 없습니다.");
            }
        } else {
            Alert.alert("OTP 확인 실패", "OTP 코드를 다시 확인하세요.");
        }
    } catch (error) {
        console.error("OTP 인증 실패:", error);
        Alert.alert("오류 발생", "OTP 인증 중 문제가 발생했습니다.");
    }
};

const handleOTPFocus = () => {
  setOtp(Array(6).fill('')); // 모든 입력 초기화
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
              value={email}
              placeholder="ID (Email)"
              placeholderTextColor="#D9D9D9"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text>Password</Text>
            <TextInput
              style={Styles.TextInput}
              onChangeText={setPassword}
              value={password}
              placeholder="Password"
              placeholderTextColor="#D9D9D9"
              secureTextEntry={true}
            />

            {errorMessage ? (
              <Text style={Styles.ErrorMessage}>{errorMessage}</Text>
            ) : null}

            <TouchableOpacity style={Styles.LoginBtn} onPress={handleLogin}>
              <Text style={Styles.BtnText}>Login</Text>
            </TouchableOpacity>

            {/* 2차 인증 필요 경우 OTP 입력 UI 표시 */}
            {is2FARequired && (
              <>
                <Text style={Styles.otpText}>OTP 입력 (6자리)</Text>
                <View style={Styles.otpContainer}>
                  {otp.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={(el) => (otpRefs.current[index] = el)} // ref 설정
                      style={Styles.otpInput}
                      onChangeText={(text) => handleOTPChange(text, index)}
                      value={digit}
                      maxLength={1}
                      keyboardType="numeric"
                      
                    />
                  ))}
                </View>

                <TouchableOpacity style={Styles.loginBtn} onPress={handleOTPVerification}>
                  <Text style={Styles.btnText}>OTP 확인</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              style={{ marginTop: 20 }}
              onPress={() => navigation.navigate("SignUpScreen", { screen: 'SignUpScreen' })}
            >
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
  },
  loginBtn: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
  },
  otpText: {
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  otpInput: {
    width: 40,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 18,
    marginRight: 5,
  },
});