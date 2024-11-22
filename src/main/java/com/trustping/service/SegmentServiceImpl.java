package com.trustping.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.trustping.DTO.DriveLogReceiveDTO;
import com.trustping.entity.Segment;
import com.trustping.entity.UserData;
import com.trustping.repository.SegmentRepository;

@Service
public class SegmentServiceImpl implements SegmentService {

	@Autowired
	private SegmentRepository segmentRepository;

	@Autowired
	private UserDataService userDataService;

	@Autowired
	private DriveScoreService driveScoreService;

	// 세그먼트 생성 및 업데이트
	@Override
	public void updateOrCreateSegment(DriveLogReceiveDTO dto) {
		Optional<Segment> currentSegmentOpt = segmentRepository
				.findTopByCarId_CarIdOrderByStartTimeDesc(dto.getCarId());
		Optional<UserData> userDataOpt = userDataService.getUserDataByCarId(dto.getCarId());

		if (userDataOpt.isEmpty()) {
			return;
		}

		UserData userData = userDataOpt.get();

		if (currentSegmentOpt.isEmpty() || currentSegmentOpt.get().getTotalDuration() >= 18000) {
			Segment newSegment = new Segment();
			newSegment.setCarId(userData);
			newSegment.setStartTime(dto.getCreateDate());
			newSegment.setTotalDuration(0);
			newSegment.setAverageScore(100);

			// currentSegment가 존재할 경우, endTime을 설정하고 저장
			currentSegmentOpt.ifPresent(currentSegment -> {
				currentSegment.setEndTime(dto.getCreateDate());
				segmentRepository.save(currentSegment); // currentSegment 저장
			});

			segmentRepository.save(newSegment); // newSegment 저장
			return;
		}

		// currentSegment가 null이 아니고, totalDuration이 18000 미만일 경우
		Segment currentSegment = currentSegmentOpt.get();
		currentSegment.setTotalDuration(currentSegment.getTotalDuration() + 1);
		segmentRepository.save(currentSegment); // currentSegment 저장
	}

	// 세그먼트 점수 감점
	@Override
	public void updateSegmentScore(String carId) {
		Optional<Segment> currentSegmentOpt = segmentRepository.findTopByCarId_CarIdOrderByStartTimeDesc(carId);

		if (currentSegmentOpt.isEmpty()) {
			return;
		}

		Segment currentSegment = currentSegmentOpt.get();
		int totalDuration = currentSegment.getTotalDuration();
		int existingScore = currentSegment.getAverageScore();
		UserData userData = currentSegment.getCarId();
		int newScore = existingScore - 3;
		
		// 새로운 평균 점수 계산
		int updatedAverageScore = (existingScore * totalDuration + newScore) / (totalDuration + 1);

		// int updatedAverageScore = existingScore -3;
		currentSegment.setAverageScore(updatedAverageScore);
		segmentRepository.save(currentSegment);
		driveScoreService.updateDriveScore(userData);
	}
	
	// 총 주행 시간 조회
	public int findAllSegmentDriveTime(String carId) {
		List<Segment> allSegments = segmentRepository.findByCarId_CarId(carId);
		
		int totalDriveTime = 0;
		
		for (Segment segment : allSegments) {
            totalDriveTime += segment.getTotalDuration();
        }
		
		System.out.println(totalDriveTime);
		return totalDriveTime;
	}

}
