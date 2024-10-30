package com.trustping.service;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.trustping.DTO.BothPedalDTO;
import com.trustping.DTO.SAclDTO;
import com.trustping.DTO.SBrkDTO;
import com.trustping.entity.UserData;
import com.trustping.repository.AbnormalDataRepository;
import com.trustping.repository.UserDataRepository;

@Service
public class AbnormalDataServiceImpl implements AbnormalDataService{	
	
	@Autowired
	private AbnormalDataRepository abnormalDataRepository;
	
	@Autowired
	private UserDataRepository userDataRepository;
	
	/*
	public SAclDTO getSaclByCarIdAndDate(String carId, LocalDate date) {
	    Optional<SAclDTO> result = abnormalDataRepository.findSAclByCarIdAndDate(carId, date);
	    if (result.isEmpty()) {
	        return null;
	    }
	    
        return result.get();
	}
	*/
	
	public SAclDTO getSaclByCarIdAndDate(String id, LocalDate date) {
	    Optional<UserData> userData = userDataRepository.findById(id);
	    
	    // UserData가 존재하는지 확인
	    if (userData.isPresent()) {
	        String carId = userData.get().getCarId();
	        System.out.println(carId);
	        Optional<SAclDTO> result = abnormalDataRepository.findSAclByCarIdAndDate(carId, date);
	        if (result.isEmpty()) {
	            return null; 
	        }
	        
	        return result.get(); 
	    } else {
	        return null; 
	    }
	}


	
	public SBrkDTO getSbrkByCarIdAndDate(String carId, LocalDate date) {
	    Optional<SBrkDTO> result = abnormalDataRepository.findSBrkByCarIdAndDate(carId, date);
	    if (result.isEmpty()) {
	        return null;
	    }
	    
        return result.get();
	}
	
	public BothPedalDTO getBothPedalByCarIdAndDate(String carId, LocalDate date) {
	    Optional<BothPedalDTO> result = abnormalDataRepository.findBothPedalByCarIdAndDate(carId, date);
	    if (result.isEmpty()) {
	        return null;
	    }
	    
	    return result.get();
	}
	
}
