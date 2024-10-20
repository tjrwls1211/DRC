import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './src/screens/MainScreen';
import MypageScreen from './src/screens/MypageScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import SuddenAcceleration from './src/screens/Analysis/SuddenAcceleration';
import SuddenBraking from './src/screens/Analysis/SuddenBraking';
import SamePedal from './src/screens/Analysis/SamePedal';
import PersonalInfoScreen from './src/screens/PersonalInfoScreen';
import AnalysisTabs from './src/screens/Analysis/AnalysisTabs';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';


const Stack = createStackNavigator(); // 스택 내비게이션 생성

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="MainScreen"
          component={MainScreen}
          options={{ headerShown: true, headerTitle: '메인 화면', headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name="MypageScreen"
          component={MypageScreen}
          options={{ headerTitle: 'MY 페이지' ,headerShown: true , headerTitleAlign: 'center'}} 
        />
        <Stack.Screen 
          name="SettingsScreen" 
          component={SettingsScreen} 
          options={{ headerShown: true, headerTitle: '설정', headerTitleAlign: 'center' }} 
        />
        <Stack.Screen 
          name="SuddenAcceleration" 
          component={SuddenAcceleration} 
          options={{ headerShown: true, headerTitle: '급가속 분석', headerTitleAlign: 'center' }} 
        />
        <Stack.Screen 
          name="SuddenBraking" 
          component={SuddenBraking} 
          options={{ headerShown: true, headerTitle: '급제동 분석', headerTitleAlign: 'center' }} 
        />
        <Stack.Screen 
          name="SamePedal" 
          component={SamePedal} 
          options={{ headerShown: true, headerTitle: '동일 페달 분석', headerTitleAlign: 'center' }} 
        />
        <Stack.Screen 
          name="PersonalInfoScreen" 
          component={PersonalInfoScreen} 
          options={{ headerShown: true, headerTitle: '개인정보', headerTitleAlign: 'center' }} 
        />
        <Stack.Screen
          name="AnalysisTabs"
          component={AnalysisTabs}
          options={{ headerShown: true, headerTitle: '', headerTitleAlign: 'center'}}
        />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


/*
// 오류 발생시 테스트용
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>DRC APP TEST</Text>
      <Text>test test 1234</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
*/