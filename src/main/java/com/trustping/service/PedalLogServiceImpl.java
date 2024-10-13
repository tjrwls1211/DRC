package com.trustping.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trustping.entity.PedalLog;
import com.trustping.repository.PedalLogRepository;

@Service
public class PedalLogServiceImpl implements PedalLogService {
	
	@Autowired
	private PedalLogRepository pedalLogRepository;
	
	public List<PedalLog> findByCarId(int carId) {
	        return pedalLogRepository.findByCarId(carId); // 이 메서드가 호출되어야 함
	  }
	 
	 @Transactional(rollbackFor = Exception.class)
	 public void deleteByCarId(int carId) {
	     System.out.println("Deleting logs for car ID: " + carId);
	     pedalLogRepository.deleteByCarId(carId);
	     System.out.println("Deletion complete.");
	 }
}
