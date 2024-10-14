package com.trustping.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trustping.entity.PedalLog;
import com.trustping.service.PedalLogService;

@RestController
@RequestMapping("/api/pedalLog")
public class PedalLogController {
	@Autowired
	private PedalLogService pedalLogService;
	
	// READ(차량 번호 입력)
	@GetMapping("/sel/{carId}")
	public ResponseEntity<List<PedalLog>> findPedalLogsByData(@PathVariable("carId") int carId) {
	    List<PedalLog> pedalLogs = pedalLogService.findByCarId(carId);
	    return ResponseEntity.ok(pedalLogs);
	}
	
	// DELETE(차량 번호 입력)
	@GetMapping("/del/{carId}")
	public void delPedalLogsByData(@PathVariable("carId") int carId) {
	    pedalLogService.deleteByCarId(carId);
	}

	
	
}
