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

	private int rapidAcceleratorCount = 0; // 연속 급가속 횟수

	public void saveMessage(String message) {
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			objectMapper.registerModule(new JavaTimeModule());

			PedalLog pedalLog = objectMapper.readValue(message, PedalLog.class);
			String currentDriveState = pedalLog.getDriveState();
			System.out.println("---------------------1----------------------");
			System.out.println("currentDriveState ::" + currentDriveState);

			if (currentDriveState.equalsIgnoreCase("Rapid Acceleration")) {
				rapidAcceleratorCount++;
				System.out.println("rapidAcceleratorCount" + rapidAcceleratorCount);

			} else if (currentDriveState.equalsIgnoreCase("normal Driving")) {
				if (rapidAcceleratorCount >= 3) {
					LocalDate date = pedalLog.getCreatedAt().toLocalDate();
					System.out.println(date);
					AbnormalData existingData = abnormalDataRepository.findByCarIdAndDate(pedalLog.getCarId(), date);
					System.out.println(existingData);
					System.out.println("------------2-----------");
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
						System.out.println("--------------------3-----------------");

					}

				}
				rapidAcceleratorCount = 0; // 카운트 초기화
			}

			pedalLogRepository.save(pedalLog); // PedalLog 저장
		} catch (IOException e) {
			e.printStackTrace(); // 예외 처리
		}
	}
}
