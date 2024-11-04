package com.trustping.service;

import java.time.LocalDate;
import java.util.List;

import com.trustping.DTO.BothPedalDTO;
import com.trustping.DTO.SAclDTO;
import com.trustping.DTO.SBrkDTO;
import com.trustping.DTO.WeeklyBothPedalDTO;
import com.trustping.DTO.WeeklySAclDTO;
import com.trustping.DTO.WeeklySBrkDTO;

public interface AbnormalDataService {
	
	public SAclDTO getSAclByCarIdAndDate(String id, LocalDate date);

	public SBrkDTO getSBrkByCarIdAndDate(String id, LocalDate date);

	public BothPedalDTO getBothPedalByCarIdAndDate(String id, LocalDate date);
	
	public List<WeeklySAclDTO> getWeeklySAcl(String token, LocalDate startDate, LocalDate endDate);

	public List<WeeklySBrkDTO> getWeeklySBrk(String token, LocalDate startDate, LocalDate endDate);

	public List<WeeklyBothPedalDTO> getWeeklyBothPedal(String token, LocalDate startDate, LocalDate endDate);
}
