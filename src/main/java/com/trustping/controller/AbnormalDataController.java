package com.trustping.controller;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trustping.DTO.SAclDTO;
import com.trustping.DTO.SBrkDTO;
import com.trustping.service.AbnormalDataService;

@RestController
public class AbnormalDataController {
	@Autowired
	private AbnormalDataService abnormalDataService;

	// 급가속 날짜로 조회
	@GetMapping("/abnormal/sacl")
	public Optional<SAclDTO> getSacl(@RequestParam(name = "carId") int carId,
			@RequestParam(name = "date") String date) {
		LocalDateTime dateTime = LocalDateTime.parse(date + "T00:00:00");
		return abnormalDataService.getSaclByCarIdAndDate(carId, dateTime);
	}

	// 급정거 날짜로 조회
	@GetMapping("/abnormal/sbrk")
	public Optional<SBrkDTO> getSbrk(@RequestParam(name = "carId") int carId,
			@RequestParam(name = "date") String date) {
		LocalDateTime dateTime = LocalDateTime.parse(date + "T00:00:00");
		return abnormalDataService.getSbrkByCarIdAndDate(carId, dateTime);
	}

}
