import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchUserInfo } from '../api/userInfoAPI';

const MypageScreen = () => {
  // 상태: 날짜, DateTimePicker 표시 여부, 유저 정보 (닉네임과 이메일)
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  const [showPicker, setShowPicker] = useState(false); 
  const [nickname, setNickname] = useState('OOO');
  const [email, setEmail] = useState('asdf_1234@gmail.com');

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const userInfo = await fetchUserInfo();
        setNickname(userInfo.nickname || '닉네임 없음');
        setEmail(userInfo.id || '이메일 없음');
      } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error);
        // 에러 발생 시 기본값 유지
      }
    };

    getUserInfo();
  }, []);

  // 날짜가 선택되었을 때 호출되는 함수
  const handleDateChange = (event, newDate) => {
    setShowPicker(false); // DateTimePicker 닫기
    if (newDate && event.type !== 'dismissed') { 
      setSelectedDate(new Date(newDate)); // 선택된 날짜를 상태에 저장
    }
  };


  return (
    <View style={styles.container}>
      {/* 유저 정보 표시 */}
      <Text style={styles.title}>{nickname}님 안녕하세요!</Text>
      <Text style={styles.email}>{email}</Text>

      {/* 날짜 선택기 */}
      <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
      />


      {/* 주행 기록 및 데이터 */}
      <View style={styles.recordContainer}>
        <View style={styles.recordBox}>
          <Text style={styles.recordTitle}>급가속</Text>
          <Text style={styles.recordValue}>4</Text> 
        </View>
        <View style={styles.recordBox}>
          <Text style={styles.recordTitle}>급정거</Text>
          <Text style={styles.recordValue}>5</Text>
        </View>
        <View style={styles.recordBox}>
          <Text style={styles.recordTitle}>동시페달</Text>
          <Text style={styles.recordValue}>7</Text>
        </View>
      </View>

      {/* 버튼들 */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>주행 기록 조회하기</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.downloadButton}>
        <Icon name="download" size={16} color="#007AFF" />
        <Text style={styles.downloadButtonText}>주행 기록 다운로드</Text>
      </TouchableOpacity>
    </View>
  );
};

// 스타일링
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#EEE',
    padding: 5,
    borderRadius: 5,
  },
  recordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    height: 150,
    alignItems: 'center',
  },
  recordBox: {
    alignItems: 'center',
  },
  recordTitle: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
  },
  recordValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  downloadButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#007AFF',
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 5,
  },
  downloadButtonText: {
    color: '#007AFF',
    fontSize: 16,
    marginLeft: 5,
  },
});

export default MypageScreen;
