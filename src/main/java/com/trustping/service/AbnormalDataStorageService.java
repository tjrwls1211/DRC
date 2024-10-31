package com.trustping.service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trustping.DTO.DriveStateDTO;
import com.trustping.entity.AbnormalData;
import com.trustping.repository.AbnormalDataRepository;

@Service
public class AbnormalDataStorageService {

    @Autowired
    private AbnormalDataRepository abnormalDataRepository;
    
    public void saveMessage(String message) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            DriveStateDTO driveStateDTO = objectMapper.readValue(message, DriveStateDTO.class);
            String carId = driveStateDTO.getCarId();
            int state = driveStateDTO.getState();
            
            LocalDate date = LocalDate.now();

            // 해당 날짜와 차량 ID로 데이터 조회
            AbnormalData existingData = abnormalDataRepository.findByCarIdAndDate(carId, date)
                .orElseGet(() -> {
                    AbnormalData newData = new AbnormalData();
                    newData.setCarId(carId);
                    newData.setDate(date);
                    newData.setSAcl(0);  
                    newData.setSBrk(0);   
                    newData.setBothPedal(0); 
                    return newData;
                });

            // 상태에 따라 값 증가
            switch (state) {
                case 1:
                    existingData.setSAcl(existingData.getSAcl() + 1);
                    break;
                case 2:
                    existingData.setSBrk(existingData.getSBrk() + 1);
                    break;
                case 3:
                    existingData.setBothPedal(existingData.getBothPedal() + 1);
                    break;
                default:
                    System.out.println("Unknown state: " + state);
                    return; 
            }

            // 데이터 저장
            abnormalDataRepository.save(existingData);
            System.out.println(existingData.getCarId() + " updated: " + existingData);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
