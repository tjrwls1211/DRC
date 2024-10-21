import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState }  from 'react';
import { SignUpUser, checkID } from "../api/authAPI";

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [isDuplicateID, setIsDuplicateID] = useState(false); // ID 중복 여부
  
  // 각각 필드에 대한 에러 메시지 상태 관리
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [formError, setFormError] = useState(''); // 전체 폼 오류 메시지 (필수 항목 누락 등)
  
  // ID 중복 확인 버튼 핸들러
  const handleCheckDuplicate = async () => {
    try {
      const isDuplicate = await checkID(email);
        setEmailError(isDuplicateID);
      if (isDuplicate) {
        setEmailError("중복된 ID입니다.");
      } else {
        setEmailError('');
      }
    } catch (error) {
      setEmailError('ID 중복 확인 오류');
      console.error(error);
    }
  };

  // 비밀번호 일치 여부 즉시 확인
  const handleConfirmPassword = (text) => {
    setConfirmPassword(text);
    if (text !== password) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
    } else {
      setConfirmPasswordError('');
    }
  };

  // 회원가입 버튼 핸들러
  const handleSignUp = async () => {
    // 비밀번호 재확인
    if (!email || !password || !confirmPassword || !nickname || !birthDate) {
      setFormError("모든 항목을 입력해 주세요.");
      return;
    }

    // 비밀번호 재확인
    if (password !== confirmPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      // 서버로 회원가입 데이터 전송 후 응답 대기
      const success = await SignUpUser(email, password, nickname, birthDate);
      if (success) {
        console.log('회원가입 성공');
        setEmailError('');
        setPasswordError('');
        setFormError('');
        setConfirmPasswordError('');
        // 로그인 화면 이동
        navigation.navigate("LoginScreen", {screen: 'LoginScreen'});
      } else {
        setFormError('회원가입에 실패했습니다. 다시 시도해 주세요.');
      }
    } catch (error) {
      // 오류 발생시 에러 메시지 출력
      setFormError('API 통신 오류');
      console.error(error);
    }
  };
  
  return (
      <View style={Styles.container}>      
        <Text style={Styles.LogoText}>DRC</Text>

        {/* ScrollView 안에 KeyboardAvoidingView 사용 */}
        {/* 필드들이 RegisterView 밖으로 벗어나지 않도록 하고, 벗어날 경우 스크롤 */}
        <View style = {Styles.RegisterView}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, justifyContent: 'center' }}
            keyboardVerticalOffset={100}
          >
          
          <ScrollView contentContainerStyle={Styles.scrollContent}>
            <View style={Styles.formContainer}>
              <Text>ID (Email)</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                <TextInput 
                  style={[Styles.TextInput, {flex: 1}]} 
                  onChangeText={setEmail}
                  placeholder="ID (Email)"
                  placeholderTextColor="#D9D9D9"
                  value={email}
                />
                <TouchableOpacity
                  style={Styles.CheckDuplicateBtn}
                  onPress={handleCheckDuplicate}>
                  <Text style={Styles.BtnText}>중복 확인</Text>
                </TouchableOpacity>
              </View>

              {/* ID 중복 에러 메시지 */}
              {emailError ? <Text style={Styles.error}>{emailError}</Text> : null}
              

              <Text>Password</Text>
              <TextInput 
                style={Styles.TextInput} 
                onChangeText={setPassword}
                placeholder="password"
                placeholderTextColor="#D9D9D9"
                secureTextEntry={true}
                value={password}
              />

              {/* 비밀번호 오류 메시지 */}
              {passwordError ? <Text style={Styles.error}>{passwordError}</Text> : null}
            
              {/* 비밀번호 확인 입력칸 */}
              <Text>Confirm Password</Text>
              <TextInput 
                style={Styles.TextInput} 
                onChangeText={handleConfirmPassword}
                placeholder="Confirm Password"
                placeholderTextColor="#D9D9D9"
                secureTextEntry={true}
                value={confirmPassword}
              />

              {/* 비밀번호 일치 여부 에러 메시지 */}
              {confirmPasswordError ? <Text style={Styles.error}>{confirmPasswordError}</Text> : null}

              <Text>Nickname</Text>
              <TextInput 
                style={Styles.TextInput} 
                onChangeText={setNickname}
                placeholder="Nickname"
                placeholderTextColor="#D9D9D9"
                value={nickname}
              />

              <Text>Birth Date</Text>
              <TextInput 
                style={Styles.TextInput} 
                onChangeText={setBirthDate}
                placeholder="Birth Date"
                placeholderTextColor="#D9D9D9"
                value={birthDate}
              />

              {/* 폼 오류 메시지(필수 항목 누락 등) */}
              {formError ? <Text style={Styles.error}>{formError}</Text> : null}

              {/* 회원가입 버튼 클릭 동작 */}
              <TouchableOpacity 
                style={Styles.SignUpBtn}
                onPress={handleSignUp}>
                <Text style={Styles.BtnText}>SignUp</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={{marginTop: 20}}
                onPress={() => navigation.navigate("LoginScreen", { screen: 'LoginScreen' })}>
                <Text style={Styles.LoginText}>로그인하러가기</Text>
              </TouchableOpacity>
              </View>
            </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

export default SignUpScreen;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  RegisterView:{
    flex: 1,
    padding:20,
    margin: 35,
    marginTop:20,
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
    marginTop:30,
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
  SignUpBtn: {
    margin: 10,
    backgroundColor: "black",
    padding: 10,
    width: "100%",
    alignSelf: "center",
    borderRadius: 10
  },
  BtnText:{
    fontWeight: 'bold',
    textAlign: 'center',
    color:'white',
  },
  LoginText: {
    fontSize: 14,
    textAlign: 'center',
    color:'#cccccc',
  },
  CheckDuplicateBtn: {
    marginLeft: 10,
    padding: 8,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginTop: -5,
    marginBottom: 10,
  },
})
