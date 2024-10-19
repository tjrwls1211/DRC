package com.trustping.service;

import java.time.LocalDateTime;
import java.util.Optional;

import com.trustping.DTO.BothPedalDTO;
import com.trustping.DTO.SAclDTO;
import com.trustping.DTO.SBrkDTO;

public interface AbnormalDataService {
	
	public Optional<SAclDTO> getSaclByCarIdAndDate(int carId, LocalDateTime dateTime);

	public Optional<SBrkDTO> getSbrkByCarIdAndDate(int carId, LocalDateTime dateTime);

	public Optional<BothPedalDTO> getBothPedalByCarIdAndDate(int carId, LocalDateTime dateTime);
	
}
