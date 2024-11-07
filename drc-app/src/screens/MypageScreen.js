import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Ionicons'; 
import { getSAcl,getSBrk, getSPedal, downDriveInfo } from '../api/driveInfoAPI';
import { formatDate } from '../utils/formatDate';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const MypageScreen = () => {
  // 상태: 날짜, DateTimePicker 표시 여부, 유저 정보 (닉네임과 이메일)
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  const [showPicker, setShowPicker] = useState(false); 
  const [nickname, setNickname] = useState('OOO');
  const [email, setEmail] = useState('asdf_1234@gmail.com');
  const [sacl, setSacl] = useState(0);
  const [sbrk, setSbrk] = useState(0);
  const [bothPedal, setBothPedal] = useState(0);
  
  // 데이터 조회 함수
  const fetchData = async () => {
    try {
      const dateString = formatDate(selectedDate); // 날짜 형식을 "YYYY-MM-DD"로 변환하는 함수
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
      setSelectedDate(new Date(newDate));
      console.log("선택된 날짜:", formatDate(newDate));
    }
  };

  // 날짜 형식을 "MM DD, YYYY"로 변환하는 함수
  const dateNotation = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const openDatePicker = () => {
    setShowPicker(true);
  };

  // CSV 파일 다운로드 기능
  const handleDownload = async () => {
    try {
      const csvData = await downDriveInfo(formatDate(selectedDate)); // 선택한 날짜로 CSV 데이터 가져오기

      // CSV 파일 저장 경로 설정
      // FileSystem.documentDirectory: Expo 앱의 샌드박스 내에서 파일을 저장할 수 있는 경로
      const fileUri = FileSystem.documentDirectory + `DriveLog_${formatDate(selectedDate)}.csv`;
      
      // 가져온 CSV 데이터를 해당 경로에 저장
      await FileSystem.writeAsStringAsync(fileUri, csvData, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // 저장한 CSV 파일 공유 대화상자 열기
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error("파일 다운로드 오류: ", error);
    }
  };


  return (
    <View style={styles.container}>
      
      {/* 유저 정보 표시 */}
      <Text style={styles.title}>{nickname} 님 안녕하세요!</Text>
      <Text style={styles.email}>{email}</Text>

      <View style={styles.headerVar} />

      <View style={styles.dateContainer}>
        <Icon1 name="calendar-outline" size={27} color={"#009688"} onPress={openDatePicker} />
        <View style={styles.dateTextContainer}>
          <Text style={styles.dateText}>{dateNotation(selectedDate)}</Text>
        </View>
      </View>

      {/* iOS인 경우 DateTimePicker를 모달로 표시 */}
      {Platform.OS === 'ios' ? (
        <Modal
          transparent={true}
          visible={showPicker}
          animationType="slide"
          onRequestClose={() => setShowPicker(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
              />
              <TouchableOpacity onPress={() => setShowPicker(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      ) : (
        // Android인 경우 기본 DateTimePicker 표시
        showPicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              handleDateChange(event, date);
              setShowPicker(false); // Android의 경우 날짜 선택 후 바로 닫기
            }}
          />
        )
      )}


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
      <TouchableOpacity style={styles.downloadButton} onPress={{handleDownload}}>
        <Icon name="download" size={16} color="#009688" />
        <Text style={styles.downloadButtonText}>주행 기록 다운로드</Text>
      </TouchableOpacity>
    </View>
  );
};

// 스타일 정의
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
  headerVar: {
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
  dateTextContainer: {
    backgroundColor: '#009688',
    marginLeft: 10,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 7
  },
  dateText: {
    fontSize: 16,
    color: '#FFF',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 모달 배경을 어둡게 설정
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#009688',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
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
