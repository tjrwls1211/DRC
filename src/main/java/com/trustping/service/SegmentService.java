package com.trustping.service;

import com.trustping.DTO.DriveLogReceiveDTO;

public interface SegmentService {
	public void updateOrCreateSegment(DriveLogReceiveDTO dto);
	public void updateSegmentScore(String carId);
	public int findAllSegmentDriveTime(String carId);
}
