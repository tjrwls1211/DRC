package com.trustping.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.trustping.entity.DriveLog;

@Repository
public interface DriveLogRepository extends JpaRepository<DriveLog, Long> {
	List<DriveLog> findByCarId(String carId);

	void deleteByCarId(String carId);

	void deleteByDriveStateAndCreatedAtBefore(String driveState, LocalDateTime targetDate);

	List<DriveLog> findByCarIdAndCreatedAtBetween(String carId, LocalDateTime start, LocalDateTime end);
}