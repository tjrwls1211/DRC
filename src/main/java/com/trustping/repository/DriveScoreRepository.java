package com.trustping.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trustping.entity.DriveScore;
import com.trustping.entity.UserData;


public interface DriveScoreRepository extends JpaRepository<DriveScore, Long> {
	Optional<DriveScore> findByUserData(UserData userData);
}
