package com.trustping.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trustping.DTO.DriveLogExcelDTO;
import com.trustping.entity.UserData;
import com.trustping.service.DriveLogService;
import com.trustping.service.UserDataHelperService;
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
	private UserDataHelperService userDataHelperService;

	@Autowired
	private ExcelUtil excelUtil;

	@GetMapping("/download")
	public void excelDownload(@RequestHeader("Authorization") String token, HttpServletResponse response, @RequestParam("date") String date) {
	    LocalDate searchDate = LocalDate.parse(date); 
	    String jwtToken = token.substring(7);
	    String id = jwtUtil.extractUsername(jwtToken);
	    Optional<UserData> car = userDataHelperService.getUserDataById(id);
	    UserData carId = car.get();
	    
	    // 엑셀 다운로드를 위한 데이터 리스트
	    List<DriveLogExcelDTO> driveLogs = driveLogService.exportDriveLog(carId, searchDate);

	    // 다운로드 수행
	    excelUtil.download(DriveLogExcelDTO.class, driveLogs,"DriveLog_"+searchDate, response);
	}
}
