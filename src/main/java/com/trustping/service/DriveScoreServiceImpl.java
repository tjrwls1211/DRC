package com.trustping.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.trustping.DTO.DriveScoreDTO;
import com.trustping.entity.DriveScore;
import com.trustping.entity.UserData;
import com.trustping.repository.DriveScoreRepository;

@Service
public class DriveScoreServiceImpl implements DriveScoreService {
	
	@Autowired
	private DriveScoreRepository driveScoreRepository;
	
	@Override
	public void registerDriveScore(UserData userData) {
		int newScore = 100;
		DriveScore driveScore = new DriveScore();
		driveScore.setScore(newScore);
		driveScore.setUserData(userData);
		driveScoreRepository.save(driveScore);
	}
	
	@Override
	public DriveScoreDTO getDriveScoreByUserId(String id) {
		Optional<DriveScore> driveScoreOpt = driveScoreRepository.findByUserData_UserId(id);
		if (driveScoreOpt.isEmpty()) {
			return null;
		}
		DriveScore driveScore = driveScoreOpt.get();
		String userId = driveScore.getUserData().getUserId();
		int score = driveScore.getScore();
		return new DriveScoreDTO(userId,score);
	}
}
