package com.trustping.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.trustping.domain.PedalLog;

@RestController
public class PedalDataController {
	
	@PostMapping("/pedal")
	public ResponseEntity<String> receivePedalLog(@RequestBody PedalLog pedalLog){
		int carId = pedalLog.getCarId();
		int aclPedal = pedalLog.getAclPedal();
		int brkPedal = pedalLog.getBrkPedal();
		String createdAt = pedalLog.getCreatedAt();
		String driveState = pedalLog.getDriveState();
		
		System.out.println(carId);
		System.out.println(aclPedal);
		System.out.println(brkPedal);
		System.out.println(createdAt);
		System.out.println(driveState);
		System.out.println("--------------------------------");
		return ResponseEntity.ok("데이터 수신 성공");
	}
}
