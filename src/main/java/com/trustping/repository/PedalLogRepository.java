package com.trustping.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trustping.entity.PedalLog;

public interface PedalLogRepository extends JpaRepository<PedalLog, Long> {
	List<PedalLog> findByCarId(String carId);
	void deleteByCarId(String carId);
}
