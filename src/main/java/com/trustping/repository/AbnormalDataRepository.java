package com.trustping.repository;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trustping.entity.AbnormalData;

public interface AbnormalDataRepository extends JpaRepository<AbnormalData, Long>{
	public int findSACLByCarIdAndCreatedAt(Long carId, LocalDateTime createdAt);
}
