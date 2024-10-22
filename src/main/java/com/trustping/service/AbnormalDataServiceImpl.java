package com.trustping.service;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.trustping.DTO.BothPedalDTO;
import com.trustping.DTO.SAclDTO;
import com.trustping.DTO.SBrkDTO;
import com.trustping.repository.AbnormalDataRepository;

@Service
public class AbnormalDataServiceImpl implements AbnormalDataService{	
	@Autowired
	private AbnormalDataRepository abnormalDataRepository;
	
	public Optional<SAclDTO> getSaclByCarIdAndDate(String carId, LocalDate date) {
        return abnormalDataRepository.findSAclByCarIdAndDate(carId, date);
    }
	
	public Optional<SBrkDTO> getSbrkByCarIdAndDate(String carId, LocalDate date) {
		return abnormalDataRepository.findSBrkByCarIdAndDate(carId, date);
	}
	
	public Optional<BothPedalDTO> getBothPedalByCarIdAndDate(String carId, LocalDate date) {
		return abnormalDataRepository.findBothPedalByCarIdAndDate(carId, date);
	}
	
	

}
