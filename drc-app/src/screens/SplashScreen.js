import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Text, Animated, Easing } from 'react-native';
import { FontAwesome5 } from 'react-native-vector-icons';

const SplashScreenComponent = ({ navigation }) => {
  const translateX = useRef(new Animated.Value(-250)).current; // 초기 X값: 왼쪽 화면 밖 
  const translateY = useRef(new Animated.Value(-40)).current; // 초기 Y값
  const opacity = useRef(new Animated.Value(0)).current; // "STOP!" 텍스트 애니메이션
  const warningOpacityLeft = useRef(new Animated.Value(0)).current; // 왼쪽 ⚠️ 투명도
  const warningOpacityRight = useRef(new Animated.Value(0)).current; // 오른쪽 ⚠️ 투명도

  useEffect(() => {
    const animateCar = () => {
      const animations = [
        Animated.timing(translateX, {
          toValue: 200, // 오른쪽으로 이동 (화면 밖)
          duration: 1200,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: -300, // 다시 왼쪽으로 이동 (화면 밖)
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 200, // 오른쪽 이동
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: -300, // 다시 왼쪽 이동
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 140, // 오른쪽 이동
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        
        // 마지막 튕기는 애니메이션과 동시에 위로 튕기기
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: 50, // 핸드폰 오른쪽 테두리에 부딪히는 위치
            duration: 300, // 튕기는 애니메이션 지속 시간
            easing: Easing.bounce, // 튕기는 효과
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -70, // 위로 이동
            duration: 300, // 위로 튕기는 애니메이션
            easing: Easing.bounce, // 튕기는 효과
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(translateY, {
          toValue: -40, // 원래 위치로 돌아오기
          duration: 200,
          easing: Easing.out(Easing.cubic), // 곡선 효과
          useNativeDriver: true,
        }),

        // "STOP!" 텍스트 애니메이션
        Animated.timing(opacity, {
          toValue: 1, // 텍스트 나타남
          duration: 400,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 400,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        // car 아이콘 곡선 그리면서 원래 위치로 돌아오기
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: -35, // 더 뒤로
            duration: 300,
            easing: Easing.out(Easing.cubic), // 부드러운 곡선 효과
            useNativeDriver: true,
          }),
          
        ]),
      ];

      Animated.sequence(animations).start();
    };

    // ⚠️ 아이콘 반짝이는 애니메이션
    const warningBlink = () => {
      const blinkAnimation = [
        Animated.timing(warningOpacityLeft, {
          toValue: 1, // ⚠️ 보이게
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(warningOpacityLeft, {
          toValue: 0, // ⚠️ 사라지게
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(warningOpacityRight, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(warningOpacityRight, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ];

      Animated.loop(Animated.sequence(blinkAnimation)).start(); // 반복 실행
    };

    animateCar();
    warningBlink();

    // 4초 후에 메인 화면으로 이동
    const timer = setTimeout(() => {
      navigation.replace('MainScreen');
    }, 4200);

    return () => clearTimeout(timer); // 클린업
  }, [navigation, translateX, translateY, opacity, warningOpacityLeft, warningOpacityRight]);

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/DRCLogo-text.png')} style={styles.logo} />
      <Text style={styles.text}>Pearl</Text>
      <Animated.View style={[styles.carContainer, { transform: [{ translateX }, { translateY }] }]}>
        <FontAwesome5 name="car-side" size={50} color="#ffffff" />
      </Animated.View>
      <Animated.View style={[styles.stopTextContainer, { opacity }]}>
        <Text style={styles.stopText}>STOP!</Text>
      </Animated.View>

      {/* ⚠️ 아이콘 */}
      <Animated.View style={[styles.warningIcon, { top: '18%', left: '70%', opacity: warningOpacityLeft }]}>
        <FontAwesome5 name="exclamation-triangle" size={20} color="#ffcc00" />
      </Animated.View>
      <Animated.View style={[styles.warningIcon, { top: '25%',right: '70%', opacity: warningOpacityRight }]}>
        <FontAwesome5 name="exclamation-triangle" size={20} color="#ffcc00" />
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
  stopTextContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
  stopText: {
    fontSize: 40,
    color: '#ff0000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  warningIcon: {
    position: 'absolute',
    top: '20%',
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
