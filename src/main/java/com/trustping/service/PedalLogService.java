package com.trustping.service;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trustping.domain.PedalLog;
import com.trustping.repository.PedalLogRepository;

@Service
public class PedalLogService {
	
	@Autowired
	private PedalLogRepository pedalLogRepository;
	
	 public void saveMessage(String message) {
	        try {
	            // 문자열 객체화
	        	ObjectMapper objectMapper = new ObjectMapper();
	            PedalLog pedalLog = objectMapper.readValue(message, PedalLog.class);
	            
	            // 10.12 DB 설치 후 추가 로직 구현
	            //pedalLogRepository.save(pedalLog);
	        } catch (IOException e) {
	            e.printStackTrace(); // 예외 처리
	        }
	    }
}
