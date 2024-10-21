package com.trustping.service;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import com.trustping.DTO.LoginRequestDTO;
import com.trustping.DTO.MfaRequestDTO;
import com.trustping.DTO.OtpDTO;
import com.trustping.DTO.SignUpRequestDTO;

public interface UserDataService {
	public boolean duplicateCheckUser(String id);
	public ResponseEntity<String> signUpUser(SignUpRequestDTO signUpRequestDTO);
	public ResponseEntity<String> LoginUser(LoginRequestDTO signInRequestDTO);
	public OtpDTO generateGoogleMFA(String id);
	public boolean verifyGoogleMFA(MfaRequestDTO mfaRequestDTO);
	public UserDetails loadUserByUsername(String username);
}