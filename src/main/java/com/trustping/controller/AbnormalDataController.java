package com.trustping.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trustping.DTO.BothPedalDTO;
import com.trustping.DTO.DriveLogExcelDTO;
import com.trustping.DTO.SAclDTO;
import com.trustping.DTO.SBrkDTO;
import com.trustping.service.AbnormalDataService;
import com.trustping.service.DriveLogService;
import com.trustping.utils.ExcelUtil;
import com.trustping.utils.JwtUtil;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/abnormal")
public class AbnormalDataController {
	
	@Autowired
	private DriveLogService driveLogService;
	
	@Autowired
	private AbnormalDataService abnormalDataService;
	
	@Autowired
	private JwtUtil jwtUtil;
	
	@Autowired
	private ExcelUtil excelUtil;
	
	// 급가속 날짜로 조회
	@GetMapping("/sacl")
	public ResponseEntity<SAclDTO> getSacl(@RequestHeader(value = "Authorization") String token, @RequestParam(name = "date") String date) {
	    LocalDate searchDate = LocalDate.parse(date); 
	    String jwtToken = token.substring(7);
	    String id = jwtUtil.extractUsername(jwtToken);
	    SAclDTO result = abnormalDataService.getSAclByCarIdAndDate(id, searchDate);
	    if (result == null) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); 
	    }
	    return ResponseEntity.ok(result);
	}

	
	// 급정거 날짜로 조회
	@GetMapping("/sbrk")
	public ResponseEntity<SBrkDTO> getSbrk(@RequestHeader(value = "Authorization") String token, @RequestParam(name = "date") String date) {
	    LocalDate searchDate = LocalDate.parse(date); 
	    String jwtToken = token.substring(7);
	    String id = jwtUtil.extractUsername(jwtToken);
	    SBrkDTO result = abnormalDataService.getSBrkByCarIdAndDate(id, searchDate);
	    if (result == null) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); 
	    }
	    return ResponseEntity.ok(result);
	}
	
	// 양발 운전 날짜로 조회
	@GetMapping("/bothPedal")
	public ResponseEntity<BothPedalDTO> getBothPedal(@RequestParam(name = "carId") String carId, @RequestParam(name = "date") String date) {
	    LocalDate searchDate = LocalDate.parse(date); 
	    BothPedalDTO result = abnormalDataService.getBothPedalByCarIdAndDate(carId, searchDate);
	    if (result == null) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); 
	    }
	    return ResponseEntity.ok(result);
	}
}
