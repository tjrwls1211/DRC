package com.trustping.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.trustping.repository.AbnormalDataRepository;

@Service
public class AbnormalDataServiceImpl implements AbnormalDataService{
	
	@Autowired
	private AbnormalDataRepository abnormalDataRepository;
	
	public int findSACLByCarIdAndCreatedAt(Long carId, LocalDateTime createdAt) {
		return abnormalDataRepository.findSACLByCarIdAndCreatedAt(carId, createdAt);
	}
}
