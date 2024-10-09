package com.trustping.DRC;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DataController {
	
	@GetMapping("/")
	public String Index() {
		return "hello";
	}
	
	@PostMapping("/data")
	public ResponseEntity<String> receivePedalLog(@RequestBody PedalLog pedal_log){
		int carId = pedal_log.getCar_id();
		int acl_pedal = pedal_log.getAcl_pedal();
		int brk_pedal = pedal_log.getBrk_pedal();
		String createAt = pedal_log.getCreateAt();
		
		// 데이터베이스 추가 로직 만들기
		System.out.println(carId);
		System.out.println(acl_pedal);
		System.out.println(brk_pedal);
		System.out.println(createAt);
		System.out.println("--------------------------------");
		return ResponseEntity.ok("데이터 수신 성공");
	}
}
