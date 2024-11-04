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

	// 비정상 주행 데이터 저장
	public void saveMessage(String message) {
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			DriveStateDTO driveStateDTO = objectMapper.readValue(message, DriveStateDTO.class);
			String carId = driveStateDTO.getCarId();
			int state = driveStateDTO.getState();

			LocalDate date = LocalDate.now();

			// 해당 날짜와 차량 ID로 데이터 조회
			Optional<AbnormalData> existingDataOpt = abnormalDataRepository.findByCarIdAndDate(carId, date);
			AbnormalData existingData;

			if (existingDataOpt.isPresent()) {
				// 기존 데이터가 있을 경우 업데이트
				existingData = existingDataOpt.get();
			} else {
				// 새로운 데이터를 생성
				existingData = new AbnormalData();
				existingData.setCarId(carId);
				existingData.setDate(date);
				existingData.setSAcl(0);
				existingData.setSBrk(0);
				existingData.setBothPedal(0);
			}

			// 상태에 따라 값 증가
			updateAbnormalData(existingData, state); // 상태 업데이트를 위한 메서드 호출

			// 데이터 저장
			abnormalDataRepository.save(existingData); // 업데이트 또는 새 데이터 삽입
			System.out.println(existingData.getCarId() + " updated: " + existingData);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	// 상태에 따른 데이터 업데이트 메서드
	private void updateAbnormalData(AbnormalData data, int state) {
		switch (state) {
		case 1:
			data.setSAcl(data.getSAcl() + 1);
			break;
		case 2:
			data.setSBrk(data.getSBrk() + 1);
			break;
		case 3:
			data.setBothPedal(data.getBothPedal() + 1);
			break;
		default:
			System.out.println("Unknown state: " + state);
			break;
		}
	}

}
