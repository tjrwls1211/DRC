package com.trustping.DRC;

import java.time.*;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class DataController {
	
	@PostMapping("/data")
	public ResponseEntity<String> receivePedalLog(@RequestBody PedalLog pedal_log){
		int carId = pedal_log.getCar_id();
		int acl_pedal = pedal_log.getAcl_pedal();
		int brk_pedal = pedal_log.getBrk_pedal();
		LocalDateTime createAt = pedal_log.getCreateAt();
		
		// 데이터베이스 추가 로직 만들기
		
		return ResponseEntity.ok("데이터 수신 성공");
	}
}
