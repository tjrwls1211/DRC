package com.trustping.service;

import java.util.List;

import com.trustping.entity.PedalLog;

public interface PedalLogService {
	public List<PedalLog> findByCarId(int carId);
	public void deleteByCarId(int carId);
}
