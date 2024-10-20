package com.trustping.controller;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trustping.DTO.BothPedalDTO;
import com.trustping.DTO.SAclDTO;
import com.trustping.DTO.SBrkDTO;
import com.trustping.service.AbnormalDataService;

@RestController
@RequestMapping("/api/abnormal")
public class AbnormalDataController {
	@Autowired
	private AbnormalDataService abnormalDataService;
	
	// 급가속 날짜로 조회
	@GetMapping("/sacl")
	public Optional<SAclDTO> getSacl(@RequestParam(name = "carId") int carId,
			@RequestParam(name = "date") String date) {
		LocalDate searchDate = LocalDate.parse(date);
		return abnormalDataService.getSaclByCarIdAndDate(carId, searchDate);
	}

	// 급정거 날짜로 조회
	@GetMapping("/sbrk")
	public Optional<SBrkDTO> getSbrk(@RequestParam(name = "carId") int carId,
			@RequestParam(name = "date") String date) {
		LocalDate searchDate = LocalDate.parse(date);
		return abnormalDataService.getSbrkByCarIdAndDate(carId, searchDate);
	}

	// 양발 운전 날짜로 조회
	@GetMapping("/bothPedal")
	public Optional<BothPedalDTO> getBothPedal(@RequestParam(name = "carId") int carId,
			@RequestParam(name = "date") String date) {
		LocalDate searchDate = LocalDate.parse(date);
		return abnormalDataService.getBothPedalByCarIdAndDate(carId, searchDate);
	}
}
