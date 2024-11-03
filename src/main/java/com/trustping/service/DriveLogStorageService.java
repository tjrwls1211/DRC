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
	private DriveLogRepository pedalLogRepository;

	@Autowired
	private DriveLogService pedalLogService;

	// 정상 주행 데이터 삭제
	@Scheduled(fixedRate = 10000)
	public void deleteOldNormalLogs() {
		LocalDateTime targetTime = LocalDateTime.now().minusMinutes(5);
		pedalLogService.deleteOldNormalLogs(targetTime);
	}

	// 페달 로그 저장
	public void saveMessage(String message) {
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			objectMapper.registerModule(new JavaTimeModule());
			DriveLog pedalLog = objectMapper.readValue(message, DriveLog.class);
		
			pedalLogRepository.save(pedalLog);
			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
