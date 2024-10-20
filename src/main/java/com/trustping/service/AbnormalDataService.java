package com.trustping.service;

import java.time.LocalDate;
import java.util.Optional;

import com.trustping.DTO.BothPedalDTO;
import com.trustping.DTO.SAclDTO;
import com.trustping.DTO.SBrkDTO;

public interface AbnormalDataService {
	
	public Optional<SAclDTO> getSaclByCarIdAndDate(int carId, LocalDate date);

	public Optional<SBrkDTO> getSbrkByCarIdAndDate(int carId, LocalDate date);

	public Optional<BothPedalDTO> getBothPedalByCarIdAndDate(int carId, LocalDate date);
	
}
