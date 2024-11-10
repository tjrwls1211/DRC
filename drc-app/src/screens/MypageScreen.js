import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Ionicons'; 
import { getSAcl, getSBrk, getSPedal, downDriveInfo } from '../api/driveInfoAPI';
import { formatDate } from '../utils/formatDate';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useTheme } from '../components/Mode/ThemeContext'; // 다크 모드 Context import

const MypageScreen = () => {
  const { isDarkMode } = useTheme(); // 다크 모드 상태 가져오기
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  const [showPicker, setShowPicker] = useState(false); 
  const [nickname, setNickname] = useState('OOO');
  const [email, setEmail] = useState('asdf_1234@gmail.com');
  const [sacl, setSacl] = useState(0);
  const [sbrk, setSbrk] = useState(0);
  const [bothPedal, setBothPedal] = useState(0);

  const fetchData = async () => {
    try {
      const dateString = formatDate(selectedDate);
      const saclData = await getSAcl(dateString);
      const sbrkData = await getSBrk(dateString);
      const bothPedalData = await getSPedal(dateString);

      setSacl(saclData.sacl);
      setSbrk(sbrkData.sbrk);
      setBothPedal(bothPedalData.bothPedal);
    } catch (error) {
      console.error('주행 기록 조회 실패:', error);
    }
  };

  const handleDateChange = (event, newDate) => {
    if (newDate && event.type !== 'dismissed') {
      setSelectedDate(new Date(newDate));
    }
  };

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

  const handleDownload = async () => {
    try {
      const csvData = await downDriveInfo(formatDate(selectedDate));
      const fileUri = FileSystem.documentDirectory + `DriveLog_${formatDate(selectedDate)}.csv`;
      
      await FileSystem.writeAsStringAsync(fileUri, csvData, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error("파일 다운로드 오류: ", error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#fff' }]}>
      <Text style={[styles.title, { color: isDarkMode ? '#ffffff' : '#2F4F4F' }]}>{nickname} 님 안녕하세요!</Text>
      <Text style={[styles.email, { color: isDarkMode ? '#d3d3d3' : '#495c5c' }]}>{email}</Text>

      <View style={styles.headerVar} />

      <View style={styles.dateContainer}>
        <Icon1 name="calendar-outline" size={27} color={isDarkMode ? '#00BFAE' : "#009688"} onPress={openDatePicker} />
        <View style={[styles.dateTextContainer, { backgroundColor: isDarkMode ? '#009688' : '#009688' }]}>
          <Text style={styles.dateText}>{dateNotation(selectedDate)}</Text>
        </View>
      </View>

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
        showPicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              handleDateChange(event, date);
              setShowPicker(false);
            }}
          />
        )
      )}

      <View style={styles.recordContainer}>
        <View style={[styles.recordBox, { backgroundColor: isDarkMode ? '#40807F' : '#d5e3e2' }]}>
          <Text style={[styles.recordTitle, { color: isDarkMode ? '#ffffff' : '#2F4F4F' }]}>급가속</Text>
          <Text style={[styles.recordValue, { color: isDarkMode ? '#ffffff' : '#2F4F4F' }]}>{sacl}</Text> 
        </View>
        <View style={[styles.recordBox, { backgroundColor: isDarkMode ? '#40807F' : '#d5e3e2' }]}>
          <Text style={[styles.recordTitle, { color: isDarkMode ? '#ffffff' : '#2F4F4F' }]}>급정거</Text>
          <Text style={[styles.recordValue, { color: isDarkMode ? '#ffffff' : '#2F4F4F' }]}>{sbrk}</Text>
        </View>
        <View style={[styles.recordBox, { backgroundColor: isDarkMode ? '#40807F' : '#d5e3e2' }]}>
          <Text style={[styles.recordTitle, { color: isDarkMode ? '#ffffff' : '#2F4F4F' }]}>동시페달</Text>
          <Text style={[styles.recordValue, { color: isDarkMode ? '#ffffff' : '#2F4F4F' }]}>{bothPedal}</Text>
        </View>
      </View>

      <TouchableOpacity style={[styles.button, { backgroundColor: isDarkMode ? '#009688' : '#009688' }]} onPress={fetchData}>
        <Text style={styles.buttonText}>주행 기록 조회하기</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.downloadButton, { borderColor: isDarkMode ? '#009688' : '#009688' }]} onPress={handleDownload}>
      <Icon name="download" size={16} color={isDarkMode ? '#009688' : '#009688'} />
        <Text style={[styles.downloadButtonText, { color: isDarkMode ? '#009688' : '#009688' }]}>주행 기록 다운로드</Text>
      </TouchableOpacity>
    </View>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
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
    marginLeft: 10,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 7,
  },
  dateText: {
    fontSize: 16,
    color: '#FFF',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  recordBox:
 {
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
