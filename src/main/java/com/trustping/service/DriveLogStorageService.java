package com.trustping.service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.trustping.DTO.MfaResponseDTO;
import com.trustping.entity.AbnormalData;
import com.trustping.entity.DriveLog;
import com.trustping.repository.AbnormalDataRepository;
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
	public void saveData(String message) {
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			objectMapper.registerModule(new JavaTimeModule());
			DriveLog driveLog = objectMapper.readValue(message, DriveLog.class);
			
			driveLogRepository.save(driveLog);
			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
