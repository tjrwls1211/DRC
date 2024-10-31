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
import com.trustping.entity.PedalLog;
import com.trustping.repository.AbnormalDataRepository;
import com.trustping.repository.PedalLogRepository;

@Service
public class PedalLogStorageService {

	@Autowired
	private PedalLogRepository pedalLogRepository;

	@Autowired
	private PedalLogService pedalLogService;

	// 정상 주행 데이터 삭제
	@Scheduled(fixedRate = 10000)
	public void deleteOldNormalLogs() {
		LocalDateTime targetTime = LocalDateTime.now().minusMinutes(5);
		pedalLogService.deleteOldNormalLogs(targetTime);
	}

	// 페달 로그와 비정상 주행 데이터 저장
	public void saveMessage(String message) {
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			objectMapper.registerModule(new JavaTimeModule());
			PedalLog pedalLog = objectMapper.readValue(message, PedalLog.class);
		
			pedalLogRepository.save(pedalLog);
			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
