package com.trustping.service;

import java.time.LocalDateTime;
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

	public List<PedalLog> findByCarId(String carId) {
		return pedalLogRepository.findByCarId(carId);
	}

	@Transactional(rollbackFor = Exception.class)
	public void deleteByCarId(String carId) {
		pedalLogRepository.deleteByCarId(carId);
	}

	@Transactional(rollbackFor = Exception.class)
	public void deleteOldNormalLogs(LocalDateTime targetDate) {
		pedalLogRepository.deleteOldNormalLogs(targetDate);
	}

}
