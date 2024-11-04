package com.trustping.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.trustping.DTO.BothPedalDTO;
import com.trustping.DTO.SAclDTO;
import com.trustping.DTO.SBrkDTO;
import com.trustping.DTO.WeeklyBothPedalDTO;
import com.trustping.DTO.WeeklySAclDTO;
import com.trustping.DTO.WeeklySBrkDTO;
import com.trustping.entity.AbnormalData;
import com.trustping.entity.UserData;
import com.trustping.repository.AbnormalDataRepository;
import com.trustping.repository.UserDataRepository;
import com.trustping.utils.JwtUtil;

@Service
public class AbnormalDataServiceImpl implements AbnormalDataService{	
	
	@Autowired
	private AbnormalDataRepository abnormalDataRepository;
	
	@Autowired 
	private UserDataService userDataService;
	
	@Autowired
	private UserDataRepository userDataRepository;
	
	@Autowired
	private JwtUtil jwtUtil;
	
	// 하루 단위 급가속 조회
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

	// 하루 단위 급정거 조회
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
	
	// 하루 단위 양발 운전 조회
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
	
	// 2주 단위 급가속 조회
	@Override
	public List<WeeklySAclDTO> getWeeklySAcl(String token, LocalDate startDate, LocalDate endDate){
	    String jwtToken = token.substring(7);
	    String id = jwtUtil.extractUsername(jwtToken);
	    String carId = userDataService.getCarIdById(id);
		
		List<AbnormalData> weeklyData = abnormalDataRepository.findByCarIdAndDateBetween(carId, startDate, endDate);

	    // 데이터 리스트를 DTO로 변환
	    List<WeeklySAclDTO> weeklySAcl = weeklyData.stream()
	            .map(sAclLog -> new WeeklySAclDTO(
	                    sAclLog.getDate(),
	                    sAclLog.getSAcl()))
	            .collect(Collectors.toList());

	    // 변환된 DTO 리스트 반환
	    return weeklySAcl;
	}
	
	// 2주 단위 급정거 조회
	@Override
	public List<WeeklySBrkDTO> getWeeklySBrk(String token, LocalDate startDate, LocalDate endDate){
	    String jwtToken = token.substring(7);
	    String id = jwtUtil.extractUsername(jwtToken);
	    String carId = userDataService.getCarIdById(id);
		
		List<AbnormalData> weeklyData = abnormalDataRepository.findByCarIdAndDateBetween(carId, startDate, endDate);

	    // 데이터 리스트를 DTO로 변환
	    List<WeeklySBrkDTO> weeklySBrk = weeklyData.stream()
	            .map(sBrkLog -> new WeeklySBrkDTO(
	                    sBrkLog.getDate(),
	                    sBrkLog.getSBrk()))
	            .collect(Collectors.toList());

	    // 변환된 DTO 리스트 반환
	    return weeklySBrk;
	}
	
	// 2주 단위 양발 운전
	@Override
	public List<WeeklyBothPedalDTO> getWeeklyBothPedal(String token, LocalDate startDate, LocalDate endDate){
	    String jwtToken = token.substring(7);
	    String id = jwtUtil.extractUsername(jwtToken);
	    String carId = userDataService.getCarIdById(id);
		
		List<AbnormalData> weeklyData = abnormalDataRepository.findByCarIdAndDateBetween(carId, startDate, endDate);

	    // 데이터 리스트를 DTO로 변환
	    List<WeeklyBothPedalDTO> weeklyBothPedal = weeklyData.stream()
	            .map(BothPedalLog -> new WeeklyBothPedalDTO(
	                    BothPedalLog.getDate(),
	                    BothPedalLog.getBothPedal()))
	            .collect(Collectors.toList());

	    // 변환된 DTO 리스트 반환
	    return weeklyBothPedal;
	}
		
	
}
