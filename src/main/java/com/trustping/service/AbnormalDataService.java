package com.trustping.service;

import java.time.LocalDate;

import com.trustping.DTO.BothPedalDTO;
import com.trustping.DTO.SAclDTO;
import com.trustping.DTO.SBrkDTO;

public interface AbnormalDataService {
	
	public SAclDTO getSaclByCarIdAndDate(String carId, LocalDate date);

	public SBrkDTO getSbrkByCarIdAndDate(String carId, LocalDate date);

	public BothPedalDTO getBothPedalByCarIdAndDate(String carId, LocalDate date);
	
}
