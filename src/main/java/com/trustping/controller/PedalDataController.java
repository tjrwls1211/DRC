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
		int carId = pedalLog.getCar_id();
		int acl_pedal = pedalLog.getAcl_pedal();
		int brk_pedal = pedalLog.getBrk_pedal();
		String createAt = pedalLog.getCreateAt();
		
		System.out.println(carId);
		System.out.println(acl_pedal);
		System.out.println(brk_pedal);
		System.out.println(createAt);
		System.out.println("--------------------------------");
		return ResponseEntity.ok("데이터 수신 성공");
	}
}
