package com.trustping.service;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.trustping.entity.PedalLog;
import com.trustping.repository.PedalLogRepository;



@Service
public class PedalLogSaveService {
	
	@Autowired
	private PedalLogRepository pedalLogRepository;
	
	 public void saveMessage(String message) {
	        try {
	            // 문자열 객체화
	        	ObjectMapper objectMapper = new ObjectMapper();
	        	objectMapper.registerModule(new JavaTimeModule());
	        	
	            PedalLog pedalLog = objectMapper.readValue(message, PedalLog.class);
	            
	            // DB에 데이터 추가 
	            pedalLogRepository.save(pedalLog);
	            
	        } catch (IOException e) {
	            e.printStackTrace(); // 예외 처리
	        }
	    }

}
