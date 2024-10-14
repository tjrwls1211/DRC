import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';

const MypageScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date()); // 날짜 상태 관리
  const [showPicker, setShowPicker] = useState(false); // DateTimePicker 표시 여부

  const handleDateChange = (event, newDate) => {
    setShowPicker(false); // DateTimePicker 닫기
    if (newDate && event.type !== 'dismissed') { // 날짜 선택될 때만 업데이트
      setSelectedDate(new Date(newDate)); // Date 객체로 선택된 날짜 반환
    }
    //setSelectedDate(new Date(newDate)); // 선택된 날짜 업데이트
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OOO님 안녕하세요!</Text>
      <Text style={styles.email}>example1234@gmail.com</Text>

      <View style={styles.dateContainer}>
        <Icon name="calendar" size={20} color="#000" />
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      </View>

      <Button title="주행 기록 조회하기" onPress={console.log(selectedDate.toDateString())}/>
      <Button title="주행 기록 다운로드" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
   calendarIcon: {
    fontSize: 24,
    marginLeft: 10,
  }
})

export default MypageScreen;
