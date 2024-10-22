package com.trustping.service;

import java.time.LocalDateTime;
import java.util.List;

import com.trustping.entity.PedalLog;

public interface PedalLogService {
	public List<PedalLog> findByCarId(String carId);
	public void deleteByCarId(String carId);
	public void deleteOldNormalLogs(LocalDateTime targetDate);
}
