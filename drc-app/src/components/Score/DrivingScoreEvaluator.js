import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DrivingScoreEvaluator = ({ score, setScore }) => {
  const [acceleration, setAcceleration] = useState(0); // 가속도 (m/s²)
  const [prevSpeed, setPrevSpeed] = useState(0); // 이전 속도 (km/h)
  const [previousSpeed, setPreviousSpeed] = useState(0); // 이전 속도 (km/h)
  const [currentSpeed, setCurrentSpeed] = useState(0); // 현재 속도 (km/h)


  // 1초마다 가속도 계산 및 점수 평가
  useEffect(() => {
    const interval = setInterval(() => {
      const newSpeed = getVehicleSpeed(); // 현재 속도 (km/h)
      const currentRPM = getVehicleRPM(); // 현재 RPM
      
      // 이전 속도를 임시 변수에 저장하고, 이후에 prevSpeed 업데이트
      setPreviousSpeed(prevSpeed);
      
      // 속도의 변화량을 통해 가속도 계산 (1초 간격이므로 delta_t = 1)
      const deltaSpeed = newSpeed - previousSpeed;
      const accelerationMs = (deltaSpeed * 1000) / 3600; // km/h to m/s² 변환
      setAcceleration(accelerationMs);
      setCurrentSpeed(newSpeed); // 현재 속도 업데이트

      // 가속도에 따라 점수 업데이트
    if(score > 0){
        // 급가속 감점
        if (accelerationMs <= 1.5) {
            // 정상 가속 (감점 없음)
        } else if (accelerationMs > 1.5 && accelerationMs <= 3) {
            setScore(score => score - 1); // 경고 수준
        } else if (accelerationMs > 3) {
            if (score <= 3){
                setScore(0);
            } else {
            setScore(score => score - 3); // 급가속
            }
        }

        //급감속 감점
        if (accelerationMs >= -1.5) {
            // 정상 감속 (감점 없음)
        } else if (accelerationMs < -1.5 && accelerationMs >= -3) {
            setScore(score => score - 1); // 경고 수준
        } else if (accelerationMs < -3) {
            if (score <= 3){
                setScore(0);
            } else {
            setScore(score => score - 3); // 급감속
            }
        }
    } 
      setPrevSpeed(newSpeed); // 이전 속도를 현재 속도로 업데이트
    }, 1000);

    return () => clearInterval(interval);
  }, [prevSpeed]);

  // 가상 센서 데이터 함수 예제 (테스트용)
  const getVehicleSpeed = () => Math.random() * 100; // 임의의 속도 값 (0~100 km/h)
  const getVehicleRPM = () => Math.random() * 5000; // 임의의 RPM 값 (0~5000 RPM)

  return (
    ////테스트용 화면
    // <View style={styles.container}>
    //   <Text style={styles.title}>Acceleration Monitor</Text>
    //   <Text style={styles.info}>이전 속도: {previousSpeed.toFixed(2)} km/h</Text>
    //   <Text style={styles.info}>현재 속도: {currentSpeed.toFixed(2)} km/h</Text>
    //   <Text style={styles.info}>현재 RPM: {getVehicleRPM().toFixed(0)} RPM</Text>
    //   <Text style={styles.info}>가속: {acceleration.toFixed(2)} m/s²</Text>
    //   <Text style={styles.info}>Score: {score}</Text>
    // </View>
    null
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    marginVertical: 5,
  },
});

export default DrivingScoreEvaluator;
