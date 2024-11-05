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

    public void evaluateScore(DriveLog driveLog) {
    	UserData userData = driveLog.getCarId();
        String carId = userData.getCarId(); // String 타입의 carId로 변경
        double acceleration = driveLog.getAcceleration();
        double currentScore = scoreCache.getOrDefault(carId, 0.0);

        if (acceleration >= 13.5) {
            currentScore += 0.5; // 총합으로 감점 할 것이기 때문에 +
            scoreCache.put(carId, currentScore);
        } else if  (acceleration >= 11.5) {
            currentScore += 0.3; 
            scoreCache.put(carId, currentScore);
        } else if (acceleration >= 10) {
            currentScore += 0.1; 
            scoreCache.put(carId, currentScore);
        } else if (acceleration <= -7.5) {
            currentScore += 0.1; 
            scoreCache.put(carId, currentScore);
        } else if (acceleration <= -10.5) {
            currentScore += 0.1; 
            scoreCache.put(carId, currentScore);
        }
    }

    // 10초마다 점수 저장
    @Scheduled(fixedRate = 10000)
    public void saveScoresPeriodically() {
        for (Map.Entry<String, Double> entry : scoreCache.entrySet()) {
            String carId = entry.getKey();
            double currentScore = entry.getValue();
            saveScoreToDatabase(carId, currentScore);
        }
        scoreCache.clear(); // 저장 후 캐시 비우기
    }

    private void saveScoreToDatabase(String carId, double score) {
    	String id = userDataService.getIdByCarId(carId);
    	
    }
}
