package com.trustping.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trustping.entity.UserData;
import com.trustping.service.UserDataService;

@RestController
public class UserDataController {

	@Autowired
	private UserDataService userDataService;

	// ID 중복 확인
	@PostMapping("/user/check")
	public ResponseEntity<Boolean> idDuplicateCheck(@RequestParam(name = "id") String id) {
		boolean isDuplicate = userDataService.isUserIdDuplicate(id);
		return ResponseEntity.ok(isDuplicate);
	}

	// 10.15일 확인 예정
	@PostMapping("/user/signUp")
	public void signUp(@RequestBody UserData userData) {
		userDataService.signUpUser(userData);
	}

}
