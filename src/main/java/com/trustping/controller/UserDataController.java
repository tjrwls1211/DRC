package com.trustping.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trustping.DTO.SignUpRequestDTO;
import com.trustping.service.UserDataService;

@RestController
public class UserDataController {

	@Autowired
	private UserDataService userDataService;

	// ID 중복 확인
	@PostMapping("/user/check")
	public ResponseEntity<Boolean> idDuplicateCheck(@RequestParam(name = "id") String id) {
		boolean isDuplicate = userDataService.duplicateCheckUser(id);
		return ResponseEntity.ok(isDuplicate);
	}

	 // 회원 가입
    @PostMapping("/user/signUp")
    public ResponseEntity<String> signUp(@RequestBody SignUpRequestDTO signUpRequestDTO) {
        return userDataService.signUpUser(signUpRequestDTO);
    }
}
