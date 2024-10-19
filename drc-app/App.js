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
import LoginScreen from '.src/screens/LoginScreen';
import SingUpScreen from '.src/screens/SingUpScreen';


const Stack = createStackNavigator(); // 스택 내비게이션 생성

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="MainScreen" component={MainScreen}  />
        <Stack.Screen name="MypageScreen" component={MypageScreen} options={{ headerTitle: 'MY 페이지' ,headerShown: true , headerTitleAlign: 'center'}}  />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ headerTitle: '설정', headerShown: true , headerTitleAlign: 'center'}}  />
        <Stack.Screen name="SuddenAcceleration" component={SuddenAcceleration}  />
        <Stack.Screen name="SuddenBraking" component={SuddenBraking}  />
        <Stack.Screen name="SamePedal" component={SamePedal}  />
        <Stack.Screen name="PersonalInfoScreen" component={PersonalInfoScreen} options={{ headerTitle: '개인정보' ,headerShown: true , headerTitleAlign: 'center'}} />
        <Stack.Screen name="AnalysisTabs" component={AnalysisTabs} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SingUpScreen" component={SingUpScreen} />
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