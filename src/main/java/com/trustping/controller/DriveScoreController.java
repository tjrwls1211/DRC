package com.trustping.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trustping.DTO.DriveScoreDTO;
import com.trustping.service.DriveScoreService;

@RestController
@RequestMapping("/api/score")
public class DriveScoreController {
	
	@Autowired
	private DriveScoreService driveScoreService;
	
	// 점수 확인
	@GetMapping("/checkScore")
	public ResponseEntity<DriveScoreDTO> checkScore(@RequestHeader("Authorization") String token, @RequestParam("id") String id){
		DriveScoreDTO result = driveScoreService.getDriveScoreByUserId(id);
		return ResponseEntity.ok(result);
	}
}
