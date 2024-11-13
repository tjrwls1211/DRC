package com.trustping.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.trustping.DTO.DriveScoreDTO;
import com.trustping.entity.DriveScore;
import com.trustping.entity.Segment;
import com.trustping.entity.UserData;
import com.trustping.repository.DriveScoreRepository;
import com.trustping.repository.SegmentRepository;

@Service
public class DriveScoreServiceImpl implements DriveScoreService {
	
	@Autowired
	private DriveScoreRepository driveScoreRepository;
	
	@Autowired
	private SegmentRepository segmentRepository;
	
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
	
	
	public void updateDriveScore(UserData userData) {
	    // 최신 6개 세그먼트를 가져오기
	    List<Segment> recentSegments = segmentRepository.findTop6ByCarId_CarIdOrderByStartTimeDesc(
	        userData.getCarId(), PageRequest.of(0, 6)
	    );

	    // 세그먼트가 하나 이상 있으면 평균 점수를 계산
	    int averageScore = 100; 

	    if (!recentSegments.isEmpty()) {
	        // 최근 세그먼트들의 평균 점수 계산
	        int totalScore = 0;
	        for (Segment segment : recentSegments) {
	            totalScore += segment.getAverageScore();
	        }

	        // 6개 미만일 경우 실제 세그먼트 개수만큼 평균 계산
	        averageScore = totalScore / recentSegments.size();
	    }

	    // DriveScore 엔티티 업데이트
	    Optional<DriveScore> driveScoreOpt = driveScoreRepository.findByUserData(userData);
	    if (driveScoreOpt.isPresent()) {
	        DriveScore driveScore = driveScoreOpt.get();
	        driveScore.setScore(averageScore);
	        driveScoreRepository.save(driveScore);
	    }
	}

	  
}

