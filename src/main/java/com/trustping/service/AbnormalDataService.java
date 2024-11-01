package com.trustping.service;

import java.time.LocalDate;

import com.trustping.DTO.BothPedalDTO;
import com.trustping.DTO.SAclDTO;
import com.trustping.DTO.SBrkDTO;

public interface AbnormalDataService {
	
	public SAclDTO getSAclByCarIdAndDate(String id, LocalDate date);

	public SBrkDTO getSBrkByCarIdAndDate(String id, LocalDate date);

	public BothPedalDTO getBothPedalByCarIdAndDate(String id, LocalDate date);
	
}
