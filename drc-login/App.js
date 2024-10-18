import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import {NavigationContainer} from '@react-navigation/native'

import {createStackNavigator} from '@react-navigation/stack'
import {createDrawerNavigator} from '@react-navigation/drawer'
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs"
import LoginScreen from './Screen/LoginScreen'
import RegisterScreen from './Screen/RegisterScreen'
import Navigation from './Navigation'

export default function App() {
  return (
      <Navigation/>
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
