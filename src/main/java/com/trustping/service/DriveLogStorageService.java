package com.trustping.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.trustping.DTO.DriveLogReceiveDTO;
import com.trustping.entity.DriveLog;
import com.trustping.entity.UserData;
import com.trustping.repository.DriveLogRepository;

@Service
public class DriveLogStorageService {

	@Autowired
	private DriveLogRepository driveLogRepository;

	@Autowired
	private DriveLogService	driveLogService;
	
	@Autowired
	private UserDataService userDataService;

	// 정상 주행 데이터 삭제
	@Scheduled(fixedRate = 10000)
	public void deleteOldNormalLogs() {
		LocalDateTime targetTime = LocalDateTime.now().minusMinutes(5);
		driveLogService.deleteOldNormalLogs(targetTime);
	}

	// 주행 로그 저장
	public void saveData(DriveLogReceiveDTO driveLogReceiveDTO) {
		Optional<UserData> userDataOpt = userDataService.getUserDataByCarId(driveLogReceiveDTO.getCarId());
		
		if (userDataOpt.isEmpty()) {
			return;
		}
		
		UserData userData = userDataOpt.get();
		
		DriveLog driveLog = new DriveLog();
		driveLog.setCarId(userData);
		driveLog.setAclPedal(driveLogReceiveDTO.getAclPedal());
		driveLog.setBrkPedal(driveLogReceiveDTO.getBrkPedal());
		driveLog.setSpeed(driveLogReceiveDTO.getSpeed());
		driveLog.setRpm(driveLogReceiveDTO.getRpm());
		driveLog.setSpeedChange(driveLogReceiveDTO.getSpeedChange());
		driveLog.setCreateDate(driveLogReceiveDTO.getCreateDate());
		driveLog.setDriveState(driveLogReceiveDTO.getDriveState());
		
		driveLogRepository.save(driveLog);
	}
}
