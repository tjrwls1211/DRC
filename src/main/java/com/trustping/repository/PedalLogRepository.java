package com.trustping.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.trustping.entity.PedalLog;

@Repository
public interface PedalLogRepository extends JpaRepository<PedalLog, Long> {
	List<PedalLog> findByCarId(String carId);

	void deleteByCarId(String carId);
	
	@Modifying
	@Query("DELETE FROM PedalLog pl WHERE pl.driveState = 'Normal Driving' AND pl.createdAt < :targetDate")
	void deleteOldNormalLogs(@Param("targetDate") LocalDateTime targetDate);

}