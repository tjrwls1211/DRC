package com.trustping.service;

import org.springframework.http.ResponseEntity;

import com.trustping.DTO.SignUpRequestDTO;

public interface UserDataService {
	public boolean duplicateCheckUser(String id);
	public ResponseEntity<String> signUpUser(SignUpRequestDTO signUpRequestDTO);
}