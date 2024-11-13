package com.trustping.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.trustping.DTO.DriveLogReceiveDTO;
import com.trustping.entity.DriveLog;
import com.trustping.entity.Segment;
import com.trustping.entity.UserData;
import com.trustping.repository.DriveLogRepository;
import com.trustping.repository.SegmentRepository;

@Service
public class DriveLogStorageService {

	@Autowired
	private DriveLogRepository driveLogRepository;

	@Autowired
	private DriveLogService driveLogService;

	@Autowired
	private UserDataService userDataService;

	@Autowired
	private SegmentRepository segmentRepository;

	// 정상 주행 데이터 삭제
	@Scheduled(fixedRate = 10000)
	public void deleteOldNormalLogs() {
		LocalDateTime targetTime = LocalDateTime.now().minusMinutes(5);
		driveLogService.deleteOldNormalLogs(targetTime);
	}

	// 주행 로그 저장
	public void saveData(DriveLogReceiveDTO driveLogReceiveDTO) {
		Optional<UserData> userDataOpt = userDataService.getUserDataByCarId(driveLogReceiveDTO.getCarId());

		if (userDataOpt.isEmpty()) {
			return;
		}

		UserData userData = userDataOpt.get();

		DriveLog driveLog = new DriveLog();
		driveLog.setCarId(userData);
		driveLog.setAclPedal(driveLogReceiveDTO.getAclPedal());
		driveLog.setBrkPedal(driveLogReceiveDTO.getBrkPedal());
		driveLog.setSpeed(driveLogReceiveDTO.getSpeed());
		driveLog.setRpm(driveLogReceiveDTO.getRpm());
		driveLog.setSpeedChange(driveLogReceiveDTO.getSpeedChange());
		driveLog.setCreateDate(driveLogReceiveDTO.getCreateDate());
		driveLog.setDriveState(driveLogReceiveDTO.getDriveState());

		Segment currentSegment = segmentRepository.findTopByCarId_CarIdOrderByStartTimeDesc(driveLogReceiveDTO.getCarId());

		// 2. 새로운 DriveLog가 1초 단위로 추가되므로, currentSegment에 시간을 누적
		if (currentSegment == null || currentSegment.getTotalDuration() >= 36000) {
			// 새로운 구간 생성
			Segment newSegment = new Segment();
			newSegment.setCarId(userData);
			newSegment.setStartTime(driveLogReceiveDTO.getCreateDate());
			newSegment.setTotalDuration(0);
			newSegment.setAverageScore(100); // 초기화

			// 기존 Segment 종료 시간 설정
			if (currentSegment != null) {
				currentSegment.setEndTime(driveLog.getCreateDate());
				segmentRepository.save(currentSegment);
			}

			segmentRepository.save(newSegment);
			currentSegment = newSegment;
		}

		// 3. 현재 Segment의 주행 시간 누적
		currentSegment.setTotalDuration(currentSegment.getTotalDuration() + 1); // 1초 누적
		segmentRepository.save(currentSegment);

		driveLogRepository.save(driveLog);
	}
}
