// SplashScreen.js
import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import * as Font from 'expo-font';

const loadFonts = async () => {
    await Font.loadAsync({
      'Product Sans Regular': require('../../assets/fonts/Product Sans Regular.ttf'),
    });
  };
  
const SplashScreenComponent = ({ navigation }) => {
  useEffect(() => {
    // 1초 후에 메인 화면으로 이동
    const timer = setTimeout(() => {
      navigation.replace('LoginScreen'); // 메인 화면으로 이동
    }, 1000);

    return () => clearTimeout(timer); // 클린업
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/DRCLogo-text.png')} style={styles.logo} />
      <Text style={styles.text}>Pearl</Text> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#009688', // 배경 색상 설정
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    position: 'absolute', // 절대 위치로 설정
    top: '40%', // 화면의 세로 중앙
    left: '50%', // 화면의 가로 중앙
    transform: [{ translateX: -75 }, { translateY: -75 }], // 로고 크기의 절반만큼 이동
  },
  text: {
    marginTop: 700, // 로고와 텍스트 사이의 간격
    fontSize: 24, // 텍스트 크기
    color: '#ffffff', // 텍스트 색상
    fontFamily: 'Product Sans Regular',
  },
});

export default SplashScreenComponent;
