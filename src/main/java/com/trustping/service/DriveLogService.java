package com.trustping.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.trustping.DTO.DriveLogExcelDTO;
import com.trustping.entity.DriveLog;

public interface DriveLogService {
	public List<DriveLog> findByCarId(String carId);
	public void deleteOldNormalLogs(LocalDateTime targetDate);
	public List<DriveLogExcelDTO> exportDriveLog(String carId, LocalDate date);
}
