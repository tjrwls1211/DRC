import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDate } from "../../utils/formatDate";

const ChangUserInfo = ({ visible, onClose }) => {
  const [userInfo, setUserInfo] = useState({
    id: "",
    nickname: "",
    birthDate: "",
    carId: "",
  });
  const [newNickname, setNewNickname] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newBirthDate, setNewBirthDate] = useState(new Date("1990-01-01")); // 초기값 설정
  const [newCarId, setNewCarId] = useState("");
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  useEffect(() => {
    if (visible) {
      setUserInfo({
        id: "test_user123",
        nickname: "기본닉네임",
        birthDate: "1990-01-01",
        carId: "123가4567",
      });
      setNewNickname("기본닉네임");
      setNewBirthDate(new Date("1990-01-01"));
      setNewCarId("123가4567");
    }
  }, [visible]);

  useEffect(() => {
    setPasswordMatch(newPassword === confirmPassword);
  }, [newPassword, confirmPassword]);

  const handleSave = async () => {
    try {
      if (newPassword && newPassword !== confirmPassword) {
        Alert.alert("오류", "새 비밀번호가 일치하지 않습니다.");
        return;
      }

      if (newNickname !== userInfo.nickname) {
        // 닉네임 변경 API 호출
        Alert.alert("성공", "닉네임이 변경되었습니다.");
      }

      if (newPassword) {
        // 비밀번호 변경 API 호출
        Alert.alert("성공", "비밀번호가 변경되었습니다.");
      }

      if (newBirthDate && formatDate(newBirthDate) !== userInfo.birthDate) {
        // 생년월일 변경 API 호출
        console.log("선택한 생년월일:", formatDate(newBirthDate)); // 생년월일 출력
        Alert.alert("성공", "생년월일이 변경되었습니다.");
      }

      if (newCarId !== userInfo.carId) {
        // 차량번호 변경 API 호출
        Alert.alert("성공", "차량번호가 변경되었습니다.");
      }

      onClose();
    } catch (error) {
      Alert.alert("오류", "정보를 저장하는 중 문제가 발생했습니다.");
      console.error(error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={-40}
      >
        <View style={styles.modal}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <Text style={styles.title}>개인정보 변경</Text>

            {/* 사용자 ID */}
            <View style={styles.inputRow}>
              <Text style={styles.label}>ID</Text>
              <Text>{userInfo.id}</Text>
            </View>

            {/* 닉네임 변경 */}
            <View style={styles.inputRow}>
              <Text style={styles.label}>닉네임</Text>
              <TextInput
                style={styles.input}
                value={newNickname}
                onChangeText={setNewNickname}
              />
            </View>

            {/* 비밀번호 변경 */}
            <View style={styles.inputRow}>
              <Text style={styles.label}>새 비밀번호</Text>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                placeholder="새 비밀번호 입력"
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.label}>새 비밀번호 확인</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholder="비밀번호 확인"
              />
            </View>
            {!passwordMatch && (
              <Text style={styles.errorText}>비밀번호가 일치하지 않습니다.</Text>
            )}

            {/* 생년월일 변경 */}
            <View style={styles.inputRow}>
            <Text style={{ fontWeight: "bold", marginRight: -18, color: "#2F4F4F", width: 100 }}>
                생년월일
            </Text>
            <DateTimePicker
                value={newBirthDate}
                mode="date"
                display="default"
                onChange={(event, date) => {
                setDatePickerVisible(false);
                if (date) {
                    setNewBirthDate(date);
                    console.log("선택한 생년월일:", formatDate(date)); // 생년월일 출력
                }
                }}
            />
            </View>

            {/* 차량번호 표시 */}
            <View style={styles.inputRow}>
              <Text style={styles.label}>차량번호</Text>
              <Text>{userInfo.carId}</Text>
            </View>

            {/* 버튼 */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                <Text style={styles.buttonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={[styles.saveButton, !passwordMatch && styles.disabledButton]} disabled={!passwordMatch}>
                <Text style={styles.buttonText}>저장</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  scrollView: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#009688",
  },
  label: {
    fontWeight: "bold",
    marginRight: 10,
    color: "#2F4F4F",
    width: 100,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#009688",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  datePicker: {
    flex: 1, // 전체 가로 길이 사용
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#009688",
    borderRadius: 5,
    padding: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    marginLeft: 110,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "#2F4F4F",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  saveButton: {
    backgroundColor: "#009688",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  disabledButton: {
    backgroundColor: "lightgray",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ChangUserInfo;
