package com.trustping.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.trustping.entity.DriveLog;
import com.trustping.entity.UserData;

@Service
public class DriveScoreService {

	@Autowired
	private UserDataService userDataService;

	private Map<String, Double> scoreCache = new HashMap<>();
	private Map<String, Integer> abnormalDriveCount = new HashMap<>();

	public void evaluateScore(DriveLog driveLog) {
		UserData userData = driveLog.getCarId();
		String carId = userData.getCarId(); // String 타입의 carId로 변경
		double speedChange = driveLog.getSpeedChange();
		int speed = driveLog.getSpeed();
		String driveState = driveLog.getDriveState();
		
		double currentScore = scoreCache.getOrDefault(carId, 0.0);
		
		// 양발 운전 시 바로 점수 감점
		if (driveState == "Both Feet Driving") {
            currentScore += 3; 
            scoreCache.put(carId, currentScore);
            return;
		}
		
		// 속도 변화량이 양수이면 급가속 체크
		if (speedChange > 0) {
			
			checkSuddenAcceleration(speed,speedChange);
		
		// 음수인 경우 급정거 체크
		} else {
			
			checkSuddenDeceleration(speed,speedChange);
			
		}

	}

	public void checkSuddenAcceleration(int speed, double speedChange) {
		
		// 속도가 6km 이상
		if (speed >= 6) {
			// 속도 6 ~ 10 사이, 속도 변화량이 12km 이상
			if (speed <= 10 && speedChange >= 12.0) {

				// 속도가 10 ~ 20 사이, 속도 변화량이 10km 이상
			} else if (speed <= 20 && speedChange >= 10.0) {

				// 속도가 20 초과, 속도 변화량이 8 이상
			} else if (speed > 20 && speedChange >= 8) {

			}
		}
	}

	public void checkSuddenDeceleration(int speed, double speedChange) {

		// 속도가 6km 이상
		if (speed >= 6) {
			
			// 속도 6 ~ 30 사이, 속도 변화량이 12km 이상
			if (speed <= 30 && speedChange >= 12.0) {

			// 속도가 30 초과 속도 변화량이 15km 이상
			} else if (speed <= 20 && speedChange <= 15.0) {
				
			}
		}
	}

	// 10초마다 점수 저장
	@Scheduled(fixedRate = 10000)
	public void saveScoresPeriodically() {
		/*
		for (Map.Entry<String, Double> entry : scoreCache.entrySet()) {
			String carId = entry.getKey();
			double currentScore = entry.getValue();
			saveScoreToDatabase(carId, currentScore);
		}
		scoreCache.clear(); // 저장 후 캐시 비우기
		*/
	}

	private void saveScoreToDatabase(String carId, double score) {
		String id = userDataService.getIdByCarId(carId);

	}
}
