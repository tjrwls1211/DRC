package com.trustping.service;

import java.io.IOException;
import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.trustping.entity.AbnormalData;
import com.trustping.entity.PedalLog;
import com.trustping.repository.AbnormalDataRepository;
import com.trustping.repository.PedalLogRepository;

@Service
public class PedalLogSaveService {

	@Autowired
	private PedalLogRepository pedalLogRepository;

	@Autowired
	private AbnormalDataRepository abnormalDataRepository;

	private int rapidAcceleratorCount = 0;
	private int rapidBreakeCount = 0;
	private int BothPedalCount = 0;

	public void saveMessage(String message) {
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			objectMapper.registerModule(new JavaTimeModule());

			PedalLog pedalLog = objectMapper.readValue(message, PedalLog.class);
			String currentDriveState = pedalLog.getDriveState();
			System.out.println("-------------------------------------------");
			System.out.println("currentDriveState : " + currentDriveState);
				
			// 급가속 체크
			if (currentDriveState.equalsIgnoreCase("Rapid Acceleration")) {
				rapidAcceleratorCount++;
				System.out.println("rapidAcceleratorCount : " + rapidAcceleratorCount);

			} else if (!currentDriveState.equalsIgnoreCase("Rapid Acceleration")) {
				if (rapidAcceleratorCount >= 3) {
					LocalDate date = pedalLog.getCreatedAt().toLocalDate();
					System.out.println("Date : " + date);
					AbnormalData existingData = abnormalDataRepository.findByCarIdAndDate(pedalLog.getCarId(), date);
					if (existingData == null) {
						AbnormalData abnormalData = new AbnormalData();
						abnormalData.setCarId(pedalLog.getCarId());
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
				rapidAcceleratorCount = 0;
			}
			
			// 급정거 체크
			if (currentDriveState.equalsIgnoreCase("Rapid Breaking")) {
				rapidBreakeCount++;
				System.out.println("rapidBrakeCount : " + rapidBreakeCount);

			} else if (!currentDriveState.equalsIgnoreCase("Rapid Breaking")) {
				if (rapidBreakeCount >= 2) {
					LocalDate date = pedalLog.getCreatedAt().toLocalDate();
					System.out.println("Date : " + date);
					AbnormalData existingData = abnormalDataRepository.findByCarIdAndDate(pedalLog.getCarId(), date);
					if (existingData == null) {
						AbnormalData abnormalData = new AbnormalData();
						abnormalData.setCarId(pedalLog.getCarId());
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
				rapidBreakeCount = 0;
			}
			
			// 양발 운전 체크
			if (currentDriveState.equalsIgnoreCase("Both Feet Driving")) {
				BothPedalCount++;
				System.out.println("BothPedalCount" + BothPedalCount);

			} else if (!currentDriveState.equalsIgnoreCase("Both Feet Driving")) {
				if (BothPedalCount >= 2) {
					LocalDate date = pedalLog.getCreatedAt().toLocalDate();
					System.out.println("date : " + date);
					AbnormalData existingData = abnormalDataRepository.findByCarIdAndDate(pedalLog.getCarId(), date);
					if (existingData == null) {
						AbnormalData abnormalData = new AbnormalData();
						abnormalData.setCarId(pedalLog.getCarId());
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
				BothPedalCount = 0;
			}

			pedalLogRepository.save(pedalLog); 
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
