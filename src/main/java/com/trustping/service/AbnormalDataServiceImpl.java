package com.trustping.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.trustping.DTO.SAclDTO;
import com.trustping.DTO.SBrkDTO;
import com.trustping.repository.AbnormalDataRepository;

@Service
public class AbnormalDataServiceImpl implements AbnormalDataService{
	
	@Autowired
	private AbnormalDataRepository abnormalDataRepository;
	
	public Optional<SAclDTO> getSaclByCarIdAndDate(int carId, LocalDateTime dateTime) {
        return abnormalDataRepository.findSAclByCarIdAndDate(carId, dateTime);
    }
	
	public Optional<SBrkDTO> getSbrkByCarIdAndDate(int carId, LocalDateTime dateTime) {
		return abnormalDataRepository.findSBrkByCarIdAndDate(carId, dateTime);
	}

}
