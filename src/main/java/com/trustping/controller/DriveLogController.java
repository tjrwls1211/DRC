package com.trustping.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trustping.DTO.DriveLogExcelDTO;
import com.trustping.entity.DriveLog;
import com.trustping.service.DriveLogService;
import com.trustping.service.UserDataService;
import com.trustping.utils.ExcelUtil;
import com.trustping.utils.JwtUtil;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/driveLog")
public class DriveLogController {
	
	@Autowired
	private JwtUtil jwtUtil;
	
	@Autowired
	private DriveLogService driveLogService;
	
	@Autowired
	private UserDataService userDataService;

	@Autowired
	private ExcelUtil excelUtil;

	// READ(차량 번호 입력)
	@GetMapping("/sel/{carId}")
	public ResponseEntity<List<DriveLog>> findPedalLogsByData(@PathVariable("carId") String carId) {
		List<DriveLog> pedalLogs = driveLogService.findByCarId(carId);
		return ResponseEntity.ok(pedalLogs);
	}

	@GetMapping("/download")
	public void excelDownload(@RequestHeader("Authorization") String token, HttpServletResponse response, @RequestParam("date") String date) {
	    LocalDate searchDate = LocalDate.parse(date); 
	    String jwtToken = token.substring(7);
	    String id = jwtUtil.extractUsername(jwtToken);
	    String carId = userDataService.getCarIdById(id);
	    
	    // 엑셀 다운로드를 위한 데이터 리스트
	    List<DriveLogExcelDTO> driveLogs = driveLogService.exportDriveLog(carId, searchDate);

	    // 다운로드 수행
	    excelUtil.download(DriveLogExcelDTO.class, driveLogs,"DriveLog_"+searchDate, response);
	}
}
