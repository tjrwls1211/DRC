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
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatDate } from "../../utils/formatDate";
import { changeNickname, changeBirthDate } from "../../api/userInfoAPI";
import { changePassword } from "../../api/accountAPI";

const ChangUserInfo = ({ visible, onClose }) => {
  console.log("개인정보변경 모달 내 열기 상태", visible);
  const [userInfo, setUserInfo] = useState({
    id: "test_user123",
    nickname: "기본닉네임",
    birthDate: "",
    carId: "123가4567",
  });
  const [newNickname, setNewNickname] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newBirthDate, setNewBirthDate] = useState(new Date("1990-01-01")); // 초기값 설정
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false); // 저장 버튼 활성화 여부

  useEffect(() => {
    // 모달 표시 시 사용자 정보 초기화
    if (visible) {
      const initialUserInfo = {
        id: "test_user123",
        nickname: "기본닉네임",
        birthDate: "1990-01-01",
        carId: "123가4567",
      };
      setUserInfo(initialUserInfo);
      setNewNickname(initialUserInfo.nickname);
      setNewBirthDate(new Date(initialUserInfo.birthDate));
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [visible]);

  useEffect(() => {
    // 새 비밀번호와 확인 비밀번호 일치 여부 확인
    setPasswordMatch(newPassword === confirmPassword);
  }, [newPassword, confirmPassword]);

  useEffect(() => {
    // 저장 버튼 활성화 여부 설정
    const hasChanges =
      newNickname !== userInfo.nickname ||
      formatDate(newBirthDate) !== userInfo.birthDate ||
      newPassword;
    setIsSaveEnabled(hasChanges && passwordMatch);
  }, [newNickname, newBirthDate, newPassword, confirmPassword]);

  const handleSave = async () => {
    try {
      if (!isSaveEnabled) return; // 저장 버튼이 비활성화된 경우 동작하지 않음

      // 변경 사항 저장
      if (newNickname !== userInfo.nickname) {
        const response = await changeNickname(newNickname);
        if (response.success) {
          Alert.alert("성공", "닉네임이 변경되었습니다.");
        } else {
          throw new Error("닉네임 변경 실패");
        }
      }

      if (newPassword) {
        const response = await changePassword(newPassword);
        if (response.success) {
          Alert.alert("성공", "비밀번호가 변경되었습니다.");
        } else {
          throw new Error("비밀번호 변경 실패");
        }
      }

      if (formatDate(newBirthDate) !== userInfo.birthDate) {
        const response = await changeBirthDate(formatDate(newBirthDate));
        if (response.success) {
          Alert.alert("성공", "생년월일이 변경되었습니다.");
        } else {
          throw new Error("생년월일 변경 실패");
        }
      }

      onClose(); // 저장 후 모달 닫기
    } catch (error) {
      Alert.alert("오류", "정보를 저장하는 중 문제가 발생했습니다.");
      console.error(error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
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
              <Text style={styles.label}>생년월일</Text>
              <DateTimePicker
                value={newBirthDate}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setDatePickerVisible(false);
                  if (date) {
                    setNewBirthDate(date);
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
              <TouchableOpacity
                onPress={handleSave}
                style={[styles.saveButton, !isSaveEnabled && styles.disabledButton]}
                disabled={!isSaveEnabled}
              >
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
