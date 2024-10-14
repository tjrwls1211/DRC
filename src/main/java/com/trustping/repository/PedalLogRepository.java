package com.trustping.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query; 
//import org.springframework.data.repository.query.Param;

import com.trustping.entity.PedalLog;

public interface PedalLogRepository extends JpaRepository<PedalLog, Long> {
	List<PedalLog> findByCarId(int carId);
	void deleteByCarId(int carId);
	long countByCarIdAndCreatedAtAndDriveState(int carId, LocalDateTime createdAt, String driveState);
//	@Query("SELECT COUNT(p) FROM PedalLog p WHERE p.carId = :carId AND p.createdAt = :createdAt AND p.driveState = :driveState")
//    long countByCarIdAndCreatedAtAndDriveState(@Param("carId") int carId, 
//                                               @Param("createdAt") LocalDateTime createdAt, 
//                                               @Param("driveState") String driveState);
}
