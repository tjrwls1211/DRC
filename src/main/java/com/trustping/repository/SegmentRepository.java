package com.trustping.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trustping.entity.Segment;

public interface SegmentRepository extends JpaRepository<Segment, Long> {
	Segment findTopByCarId_CarIdOrderByStartTimeDesc(String carId);
}
