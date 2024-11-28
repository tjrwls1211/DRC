import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useTheme } from '../components/Mode/ThemeContext.js'; // 다크 모드 Context import
import { MaterialIcons } from '@expo/vector-icons';

const SettingsScreen = () => {
  const { isDarkMode, setIsDarkMode } = useTheme(); // 다크 모드 상태 가져오기
  
  const toggleSwitch = () => {
    setIsDarkMode(previousState => !previousState); // 다크 모드 상태를 토글
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#ffffff' }]}>
      <View style={[styles.section, { marginTop: 35 }]}>
        <MaterialIcons name="settings" size={24} color={isDarkMode ? '#ffffff' : '#009688'} /> 
        <Text style={[styles.label, styles.labelSpacing, { color: isDarkMode ? '#ffffff' : '#2F4F4F' }]}>앱 설정</Text>
      </View>

      <View style={styles.darkModeContainer}>
        <Text style={{ fontSize: 18, color: isDarkMode ? '#ffffff' : '#ffffff' }}>다크모드</Text>
        <Switch 
          value={isDarkMode}
          onValueChange={toggleSwitch}
          trackColor={{ false: '#767577', true: '#000000' }} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  labelSpacing: {
    marginLeft: 10,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10, // 섹션 간 간격 통일
  },
  label: {
    fontSize: 24,
    marginLeft: 10,
    color: '#2F4F4F', // 다크 슬레이트 그레이
    fontWeight: 'bold',
  },
  darkModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#009688', // 기본색 청록
  },
});

export default SettingsScreen;
