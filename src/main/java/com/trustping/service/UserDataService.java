package com.trustping.service;

import org.springframework.http.ResponseEntity;

import com.trustping.DTO.SignInRequestDTO;
import com.trustping.DTO.SignUpRequestDTO;

public interface UserDataService {
	public boolean duplicateCheckUser(String id);
	public ResponseEntity<String> signUpUser(SignUpRequestDTO signUpRequestDTO);
	public boolean signInUser(SignInRequestDTO signInRequestDTO);
}