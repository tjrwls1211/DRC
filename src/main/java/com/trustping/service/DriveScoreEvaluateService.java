package com.trustping.service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.trustping.DTO.DriveLogReceiveDTO;
import com.trustping.entity.DriveScore;
import com.trustping.entity.UserData;
import com.trustping.repository.DriveScoreRepository;

@Service
public class DriveScoreEvaluateService {
	
	@Autowired
	UserDataService userDataService;
	
	@Autowired
	DriveScoreRepository driveScoreRepository;
	
	private Map<String, Integer> abnormalDriveCount = new HashMap<>();

	public void evaluateScore(DriveLogReceiveDTO driveLog) {
		String carId = driveLog.getCarId(); 
		double speedChange = driveLog.getSpeedChange();
		int speed = driveLog.getSpeed();
		String driveState = driveLog.getDriveState();
		
		
		Optional<UserData> userDataOpt = userDataService.getUserDataByCarId(carId);
		if (userDataOpt.isEmpty()) {
			return;
		}
		UserData userData = userDataOpt.get();
		
		int count = abnormalDriveCount.getOrDefault(carId, 0);
		
		// 양발 운전 시 바로 점수 감점
		if ("Both Feet Driving".equals(driveState)) {
            abnormalDriveCount.put(carId, 0);
            deductScore(userData);
            return;
		}
		
		// 속도 변화량이 양수이면 급가속 체크
		if (speedChange > 0) {
			count = checkSuddenAcceleration(carId, count, speed, speedChange);
		// 음수인 경우 급정거 체크
		} else {
			count = checkSuddenDeceleration(carId, count, speed, speedChange);
		}

		abnormalDriveCount.put(carId, count);
		
		if (count==3) {
            abnormalDriveCount.put(carId, 0);
            System.out.println("카운트 초기화 "+carId);
            deductScore(userData);
		}
		
	}

	private int checkSuddenAcceleration(String carId, int count, int speed, double speedChange) {
	    
		// 급가속 조건을 충족하는지 확인하는 변수
	    boolean isSuddenAcceleration = false;

	    // 속도가 6km 이상
	    if (speed >= 6) {
	        // 속도 6 ~ 10 사이, 속도 변화량이 12km 이상
	        if (speed <= 10 && speedChange >= 12.0) {
	            count += 1;
	            isSuddenAcceleration = true;
	        // 속도가 10 ~ 20 사이, 속도 변화량이 10km 이상
	        } else if (speed <= 20 && speedChange >= 10.0) {
	            count += 1;
	            isSuddenAcceleration = true;
	        // 속도가 20 초과, 속도 변화량이 8 이상
	        } else if (speed > 20 && speedChange >= 8) {
	            count += 1;
	            isSuddenAcceleration = true;
	        }
	    }

	    // 급가속 조건이 충족되지 않으면 count를 초기화
	    if (!isSuddenAcceleration) {
	        count = 0;
	    }

	    return count;
	}

	private int checkSuddenDeceleration(String carId, int count, int speed, double speedChange) {
	    
		boolean isSuddenDeceleration = false;
		
		// 속도가 6km 이상
		if (speed >= 6) {
			// 속도 6 ~ 30 사이, 속도 변화량이 12km 이상
			if (speed <= 20 && speedChange >= 12.0) {
				count += 1;
				isSuddenDeceleration = true;
			// 속도가 30 초과 속도 변화량이 15km 이상
			} else if (speed <= 30 && speedChange <= 15.0) {
				count += 1;
				isSuddenDeceleration = true;
			}
		}
		
	    if (!isSuddenDeceleration) {
	        count = 0;
	    }

		return count;
	}

	private void deductScore(UserData userData) {
		Optional<DriveScore> driveScoreOpt = driveScoreRepository.findByUserData(userData);
		
		if (driveScoreOpt.isEmpty()) {
			return;
		}	
		
		DriveScore driveScore = driveScoreOpt.get();
		
		int lastScore = driveScore.getScore();
		driveScore.setScore(lastScore-3);
		
		driveScoreRepository.save(driveScore);
	}
}
