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
	
	@Override
	public SAclDTO getSAclByCarIdAndDate(String id, LocalDate date) {
	    Optional<UserData> userData = userDataRepository.findById(id);
	    
	    // UserData가 존재하는지 확인
	    if (userData.isPresent()) {
	        String carId = userData.get().getCarId();
	        Optional<SAclDTO> result = abnormalDataRepository.findSAclByCarIdAndDate(carId, date);
	        if (result.isEmpty()) {
	            return null; 
	        }
	        
	        return result.get(); 
	    } else {
	        return null; 
	    }
	}

	@Override
	public SBrkDTO getSBrkByCarIdAndDate(String id, LocalDate date) {
	    Optional<UserData> userData = userDataRepository.findById(id);
	    
	    // UserData가 존재하는지 확인
	    if (userData.isPresent()) {
	        String carId = userData.get().getCarId();
	        Optional<SBrkDTO> result = abnormalDataRepository.findSBrkByCarIdAndDate(carId, date);
	        if (result.isEmpty()) {
	            return null; 
	        }
	        
	        return result.get(); 
	    } else {
	        return null; 
	    }
	}
	
	@Override
	public BothPedalDTO getBothPedalByCarIdAndDate(String id, LocalDate date) {
	    Optional<UserData> userData = userDataRepository.findById(id);
	    
	    // UserData가 존재하는지 확인
	    if (userData.isPresent()) {
	        String carId = userData.get().getCarId();
	        Optional<BothPedalDTO> result = abnormalDataRepository.findBothPedalByCarIdAndDate(carId, date);
	        if (result.isEmpty()) {
	            return null; 
	        }
	        
	        return result.get(); 
	    } else {
	        return null; 
	    }
	}
	
}
