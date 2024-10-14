package com.trustping.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.trustping.dto.AbnormalDataRequest;
import com.trustping.service.AbnormalDataService;

@RestController
public class AbnormalDataController {
	@Autowired
	private AbnormalDataService abnormalDataService;
	
	@PostMapping("/abnormal/sacl")
	public ResponseEntity<Integer> getSACLData(@RequestBody AbnormalDataRequest request) {
	    int sAclValue = abnormalDataService.findSACLByCarIdAndCreatedAt(request.getCarId(), request.getCreatedAt());
	    return ResponseEntity.ok(sAclValue);
	}

}
