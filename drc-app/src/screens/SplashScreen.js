import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Text, Animated, Easing } from 'react-native';
import { FontAwesome5 } from 'react-native-vector-icons';

const SplashScreenComponent = ({ navigation }) => {
  const translateX = useRef(new Animated.Value(-250)).current; // 초기 X값: 왼쪽 화면 밖
  const translateY = useRef(new Animated.Value(-40)).current; // 초기 Y값
  const opacity = useRef(new Animated.Value(0)).current; // 초기 투명도

  useEffect(() => {
    const animateCar = () => {
      const animations = [
        Animated.timing(translateX, {
          toValue: 300, // 오른쪽으로 이동 (화면 밖)
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ];

      Animated.sequence(animations).start();
    };

    const animateLogo = () => {
      Animated.timing(opacity, {
        toValue: 1, // 완전 불투명
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    };

    animateCar();
    animateLogo();

    // 3초 후에 메인 화면으로 이동
    const timer = setTimeout(() => {
      navigation.replace('LoginScreen');
    }, 1500);

    return () => clearTimeout(timer); // 클린업
  }, [translateX, opacity]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../assets/DRCLogo-text.png')}
        style={[styles.logo, { opacity }]} // 투명도 애니메이션 적용
      />
      <Text style={styles.text}>Pearl</Text>
      <Animated.View style={[styles.carContainer, { transform: [{ translateX }, { translateY }] }]}>
        <FontAwesome5 name="car-side" size={50} color="#ffffff" />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#009688',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: [{ translateX: -75 }, { translateY: -75 }],
  },
  text: {
    marginTop: 700,
    fontSize: 24,
    color: '#ffffff',
    fontFamily: 'Product Sans Regular',
  },
  carContainer: {
    position: 'absolute',
    top: '60%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
});

export default SplashScreenComponent;



// << 기존 코드 >>
// // SplashScreen.js
// import React, { useEffect } from 'react';
// import { View, Image, StyleSheet, Text } from 'react-native';
// import * as Font from 'expo-font';

// const loadFonts = async () => {
//     await Font.loadAsync({
//       'Product Sans Regular': require('../../assets/fonts/Product Sans Regular.ttf'),
//     });
//   };
  
// const SplashScreenComponent = ({ navigation }) => {
//   useEffect(() => {
//     // 1초 후에 메인 화면으로 이동
//     const timer = setTimeout(() => {
//       navigation.replace('MainScreen'); // 메인 화면으로 이동
//     }, 1000);

//     return () => clearTimeout(timer); // 클린업
//   }, [navigation]);

//   return (
//     <View style={styles.container}>
//       <Image source={require('../../assets/DRCLogo-text.png')} style={styles.logo} />
//       <Text style={styles.text}>Pearl</Text> 
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#009688', // 배경 색상 설정
//   },
//   logo: {
//     width: 150,
//     height: 150,
//     resizeMode: 'contain',
//     position: 'absolute', // 절대 위치로 설정
//     top: '40%', // 화면의 세로 중앙
//     left: '50%', // 화면의 가로 중앙
//     transform: [{ translateX: -75 }, { translateY: -75 }], // 로고 크기의 절반만큼 이동
//   },
//   text: {
//     marginTop: 700, // 로고와 텍스트 사이의 간격
//     fontSize: 24, // 텍스트 크기
//     color: '#ffffff', // 텍스트 색상
//     fontFamily: 'Product Sans Regular',
//   },
// });

// export default SplashScreenComponent;
