package com.trustping.service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.trustping.entity.AbnormalData;
import com.trustping.entity.PedalLog;
import com.trustping.repository.AbnormalDataRepository;
import com.trustping.repository.PedalLogRepository;

@Service
public class PedalLogProcessingService {

    @Autowired
    private PedalLogRepository pedalLogRepository;

    @Autowired
    private AbnormalDataRepository abnormalDataRepository;
    
    @Autowired
    private PedalLogService pedalLogService;

    // 차량 ID를 키로 하는 카운트를 저장할 Map
    private Map<String, Integer> rapidAcceleratorCounts = new HashMap<>();
    private Map<String, Integer> rapidBrakeCounts = new HashMap<>();
    private Map<String, Integer> bothPedalCounts = new HashMap<>();
    
    // 정상 주행 데이터 삭제
    @Scheduled(fixedRate = 10000)
    public void deleteOldNormalLogs() {
    	LocalDateTime targetTime = LocalDateTime.now().minusMinutes(10);
    	pedalLogService.deleteOldNormalLogs(targetTime);
    }
    
    // 페달 로그와 비정상 주행 데이터 저장
    public void saveMessage(String message) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());

            PedalLog pedalLog = objectMapper.readValue(message, PedalLog.class);
            String carId = pedalLog.getCarId();
            String currentDriveState = pedalLog.getDriveState();
            System.out.println("-------------------------------------------");
            System.out.println("currentDriveState : " + currentDriveState);

            // 급가속 체크
            rapidAcceleratorCounts.putIfAbsent(carId, 0);
            if (currentDriveState.equalsIgnoreCase("Rapid Acceleration")) {
                rapidAcceleratorCounts.put(carId, rapidAcceleratorCounts.get(carId) + 1);
                System.out.println("rapidAcceleratorCount : " + rapidAcceleratorCounts.get(carId));
            } else {
                if (rapidAcceleratorCounts.get(carId) >= 3) {
                    LocalDate date = pedalLog.getCreatedAt().toLocalDate();
                    System.out.println("Date : " + date);
                    AbnormalData existingData = abnormalDataRepository.findByCarIdAndDate(carId, date);
                    if (existingData == null) {
                        AbnormalData abnormalData = new AbnormalData();
                        abnormalData.setCarId(carId);
                        abnormalData.setDate(date);
                        abnormalData.setSAcl(1);
                        abnormalDataRepository.save(abnormalData);
                        System.out.println("new Data: " + abnormalData);
                    } else {
                        existingData.setSAcl(existingData.getSAcl() + 1);
                        abnormalDataRepository.save(existingData);
                        System.out.println("Existing Data: " + existingData);
                        System.out.println("-------------------------------------------");
                    }
                }
                rapidAcceleratorCounts.put(carId, 0);
            }

            // 급정거 체크
            rapidBrakeCounts.putIfAbsent(carId, 0);
            if (currentDriveState.equalsIgnoreCase("Rapid Breaking")) {
                rapidBrakeCounts.put(carId, rapidBrakeCounts.get(carId) + 1);
                System.out.println("rapidBrakeCount : " + rapidBrakeCounts.get(carId));
            } else {
                if (rapidBrakeCounts.get(carId) >= 2) {
                    LocalDate date = pedalLog.getCreatedAt().toLocalDate();
                    System.out.println("Date : " + date);
                    AbnormalData existingData = abnormalDataRepository.findByCarIdAndDate(carId, date);
                    if (existingData == null) {
                        AbnormalData abnormalData = new AbnormalData();
                        abnormalData.setCarId(carId);
                        abnormalData.setDate(date);
                        abnormalData.setSBrk(1);
                        abnormalDataRepository.save(abnormalData);
                        System.out.println("new Data: " + abnormalData);
                    } else {
                        existingData.setSBrk(existingData.getSBrk() + 1);
                        abnormalDataRepository.save(existingData);
                        System.out.println("Existing Data: " + existingData);
                        System.out.println("-------------------------------------------");
                    }
                }
                rapidBrakeCounts.put(carId, 0);
            }

            // 양발 운전 체크
            bothPedalCounts.putIfAbsent(carId, 0);
            if (currentDriveState.equalsIgnoreCase("Both Feet Driving")) {
                bothPedalCounts.put(carId, bothPedalCounts.get(carId) + 1);
                System.out.println("BothPedalCount: " + bothPedalCounts.get(carId));
            } else {
                if (bothPedalCounts.get(carId) >= 2) {
                    LocalDate date = pedalLog.getCreatedAt().toLocalDate();
                    System.out.println("date : " + date);
                    AbnormalData existingData = abnormalDataRepository.findByCarIdAndDate(carId, date);
                    if (existingData == null) {
                        AbnormalData abnormalData = new AbnormalData();
                        abnormalData.setCarId(carId);
                        abnormalData.setDate(date);
                        abnormalData.setBothPedal(1);
                        abnormalDataRepository.save(abnormalData);
                        System.out.println("new Data: " + abnormalData);
                    } else {
                        existingData.setBothPedal(existingData.getBothPedal() + 1);
                        abnormalDataRepository.save(existingData);
                        System.out.println("Existing Data: " + existingData);
                        System.out.println("-------------------------------------------");
                    }
                }
                bothPedalCounts.put(carId, 0);
            }

            pedalLogRepository.save(pedalLog); 
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
