import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState }  from 'react';
import { SignUpUser, checkID } from "../api/authAPI";
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [carNumber, setCarNumber] = useState('');
  const [nickname, setNickname] = useState('');
  const [birthDate, setBirthDate] = useState(new Date()); // 초기값 Date 객체로 설정
  const [isDuplicateID, setIsDuplicateID] = useState(false); // ID 중복 여부
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // 비밀번호 보이기 상태

  
  // 각각 필드에 대한 에러 메시지 상태 관리
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [formError, setFormError] = useState(''); // 전체 폼 오류 메시지 (필수 항목 누락 등)
  
  // ID 유효성 검사 정규식
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  // 비밀번호 유효성 검사 정규식 (최소 8자, 하나 이상의 숫자, 대소문자 및 특수 문자 포함)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // ID 중복 확인 버튼 핸들러
  const handleCheckDuplicate = async () => {
    try {
      const isDuplicate = await checkID(email);
        setEmailError(isDuplicateID);
      if (!isDuplicate) {
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
    console.log("차량번호", carNumber);
    if (!email || !password || !confirmPassword || !carNumber || !nickname || !birthDate) {
      setFormError("모든 항목을 입력해 주세요.");
      return;
    }

    // 유효성 검사
    let hasError = false; // 에러 상태 플러그
    if (!emailRegex.test(email)) {
      setEmailError("유효한 이메일 주소를 입력하세요.");
      hasError = true; // 에러 발생
    } else { 
      setEmailError('');
    }
    if(!passwordRegex.test(password)) {
      setPasswordError("비밀번호는 8자 이상, 하나 이상의 숫자, 대소문자, 특수 문자를 포함해야 합니다.");
      hasError = true;
    } else {
      setPasswordError('');
    }

    // 비밀번호 재확인
    if (password !== confirmPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
      hasError = true; // 에러 발생
    } else {
      setConfirmPasswordError('');
    }

    // 에러가 있으면 회원가입 처리 중단
    if (hasError) {
      return;
    }
    console.log(email);

    // birthDate를 YYYY-MM-DD 형식으로 변환
    const formattedBirthDate = birthDate.toISOString().split('T')[0];
    console.log(formattedBirthDate);

    try {
      // 서버로 회원가입 데이터 전송 후 응답 대기
      const response = await SignUpUser(email, password, nickname, formattedBirthDate, carNumber);
      console.log(response.success);

      if (response.success) {
        console.log('회원가입 성공');
        setEmailError('');
        setPasswordError('');
        setFormError('');
        setConfirmPasswordError('');
        // 로그인 화면 이동
        navigation.navigate("LoginScreen", {screen: 'LoginScreen'});
      } else {
        console.log(response.message);
        if(response.success === false) {
          // 서버에서 받은 실패 메시지를 formError에 저장
          setFormError(response.message);
        } else setFormError('회원가입에 실패했습니다. 다시 시도해 주세요.');
      }
    } catch (error) {
      // 오류 발생시 에러 메시지 출력
      setFormError('회원가입 처리 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

  // 날짜 선택기 핸들러
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthDate; // 선택된 날짜 또는 기존 날짜
    setBirthDate(currentDate); // 생년월일 정보 업데이트

    // 선택된 날짜를 YYYY-MM-DD 형식으로 출력
    const formattedDate = currentDate.toISOString().split('T')[0];
    console.log(formattedDate);
    // setBirthDate(formattedDate);
    // console.log(birthDate);
  }
  
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
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput 
                  style={[Styles.TextInput, {flex: 1}]} 
                  onChangeText={setPassword}
                  placeholder="password"
                  placeholderTextColor="#D9D9D9"
                  secureTextEntry={!isPasswordVisible}
                  value={password}
                />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={{ marginLeft: 10 }}>
                  <Icon name={isPasswordVisible ? "eye" : "eye-slash"} size={20} color="#000" />
                </TouchableOpacity>
              </View>
              

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

              <Text>Vehicle Number</Text>
              <TextInput
                style={Styles.TextInput}
                onChangeText={setCarNumber}
                placeholder="차량번호"
                placeholderTextColor="#D9D9D9"
                value={carNumber}
              />

              <Text>Nickname</Text>
              <TextInput 
                style={Styles.TextInput} 
                onChangeText={setNickname}
                placeholder="Nickname"
                placeholderTextColor="#D9D9D9"
                value={nickname}
              />

              <Text>Birth Date</Text>
              <DateTimePicker
                value={birthDate}
                mode="date"
                display="default"
                onChange={onChange}
                style={{ width: '100%', alignItems: 'flex-start' }}
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
