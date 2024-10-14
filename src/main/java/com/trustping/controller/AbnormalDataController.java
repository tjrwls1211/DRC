package com.trustping.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.trustping.service.AbnormalDataService;

import java.time.LocalDateTime;

@RestController
public class AbnormalDataController {
    @Autowired
    private AbnormalDataService abnormalDataService;
    
    @GetMapping("/abnormal/{carId}/{dateTime}")
    public ResponseEntity<Long> getSACLData(@PathVariable("carId") Long carId, 
                                                @PathVariable("dateTime") String dateTime) {
        try {
            LocalDateTime createdAt = LocalDateTime.parse(dateTime); // 변환 시 예외 발생 가능
            Long sAclValue = abnormalDataService.findSACLByCarIdAndCreatedAt(carId, createdAt);
            return ResponseEntity.ok(sAclValue);
        } catch (Exception e) {
            // 예외 발생 시 로그 출력
            System.err.println("Error: " + e.getMessage());
            throw e; // 다시 던져서 클라이언트에 오류를 반환할 수 있도록 함
        }
    }
}
