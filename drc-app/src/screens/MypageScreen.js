import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Ionicons';
import { getSAcl,getSBrk, getSPedal } from '../api/driveInfoAPI';
import { formatDate } from '../utils/formatDate';

const MypageScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date()); // 현재 날짜로 초기화
  const [nickname, setNickname] = useState('OOO');
  const [email, setEmail] = useState('asdf_1234@gmail.com');
  const [sacl, setSacl] = useState(0);
  const [sbrk, setSbrk] = useState(0);
  const [bothPedal, setBothPedal] = useState(0);

  // 데이터 조회 함수
  const fetchData = async () => {
    try {
      const dateString = formatDate(selectedDate); // 선택된 날짜를 YYYY-MM-DD 형식으로 변환
      const saclData = await getSAcl(dateString);
      const sbrkData = await getSBrk(dateString);
      const bothPedalData = await getSPedal(dateString);
      console.log("급가속", saclData);
      console.log("급정거", sbrkData);
      console.log("양발운전", bothPedalData);

      setSacl(saclData.sacl);
      setSbrk(sbrkData.sbrk);
      setBothPedal(bothPedalData.bothPedal);
    } catch (error) {
      console.error('주행 기록 조회 실패:', error);
    }
  };

  // 날짜가 선택되었을 때 호출되는 함수
  const handleDateChange = (event, newDate) => {
    if (newDate && event.type !== 'dismissed') { 
      setSelectedDate(new Date(newDate)); // 선택된 날짜를 상태에 저장
      console.log("선택된 날짜:", formatDate(newDate));
    }
  };

  return (
    <View style={styles.container}>
      
      {/* 유저 정보 표시 */}
      <Text style={styles.title}>{nickname} 님 안녕하세요!</Text>
      <Text style={styles.email}>{email}</Text>

      <View style={styles.headerVar} />

      <View style={styles.dateContainer}>
        <Icon1 name="calendar-outline" size={27} color={"#009688"} />
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          style={styles.datePicker} // 스타일 적용
        />
      </View>


      {/* 주행 기록 및 데이터 */}
      <View style={styles.recordContainer}>
        <View style={styles.recordBox}>
          <Text style={styles.recordTitle}>급가속</Text>
          <Text style={styles.recordValue}>{sacl}</Text> 
        </View>
        <View style={styles.recordBox}>
          <Text style={styles.recordTitle}>급정거</Text>
          <Text style={styles.recordValue}>{sbrk}</Text>
        </View>
        <View style={styles.recordBox}>
          <Text style={styles.recordTitle}>동시페달</Text>
          <Text style={styles.recordValue}>{bothPedal}</Text>
        </View>
      </View>

      {/* 버튼들 */}
      <TouchableOpacity style={styles.button} onPress={fetchData}>
        <Text style={styles.buttonText}>주행 기록 조회하기</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.downloadButton}>
        <Icon name="download" size={16} color="#009688" />
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
    marginTop: 15,
    marginBottom: 5,
    color: '#2F4F4F',
  },
  email: {
    fontSize: 16,
    color: '#495c5c',
    marginBottom: 30,
  },
  headerVar:{
    backgroundColor: '#009688',
    height: 3,
    marginBottom: 60,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 15,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#FFF',
    backgroundColor: '#009688',
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 7,
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
    backgroundColor: '#d5e3e2',
    width: 105,
    height: 125,
    borderRadius: 5,
    justifyContent: 'center',
  },
  recordTitle: {
    fontSize: 16,
    color: '#2F4F4F',
    marginBottom: 13,
  },
  recordValue: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#2F4F4F',
  },
  button: {
    backgroundColor: '#009688',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 15,
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
    borderColor: '#009688',
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 5,
  },
  downloadButtonText: {
    color: '#009688',
    fontSize: 16,
    marginLeft: 5,
  },
});

export default MypageScreen;
