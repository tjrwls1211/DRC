package com.trustping.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.trustping.entity.DriveLog;
import com.trustping.repository.DriveLogRepository;

@Service
public class DriveLogStorageService {

	@Autowired
	private DriveLogRepository driveLogRepository;

	@Autowired
	private DriveLogService	driveLogService;

	// 정상 주행 데이터 삭제
	@Scheduled(fixedRate = 10000)
	public void deleteOldNormalLogs() {
		LocalDateTime targetTime = LocalDateTime.now().minusMinutes(5);
		driveLogService.deleteOldNormalLogs(targetTime);
	}

	// 주행 로그 저장
	public void saveData(DriveLog driveLog) {
		driveLogRepository.save(driveLog);
	}
}
