package com.trustping.service;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import com.trustping.DTO.LoginRequestDTO;
import com.trustping.DTO.MfaRequestDTO;
import com.trustping.DTO.MyDataResponse;
import com.trustping.DTO.OtpDTO;
import com.trustping.DTO.OtpRequestDTO;
import com.trustping.DTO.SignUpRequestDTO;
import com.trustping.DTO.SignUpResponseDTO;

public interface UserDataService {
	public boolean duplicateCheckUser(String id);
	public ResponseEntity<SignUpResponseDTO> signUpUser(SignUpRequestDTO signUpRequestDTO);
	public ResponseEntity<String> LoginUser(LoginRequestDTO signInRequestDTO);
	public OtpDTO generateGoogleMFA(OtpRequestDTO otpRequestDTO);
	public boolean verifyGoogleMFA(MfaRequestDTO mfaRequestDTO);
	public UserDetails loadUserByUsername(String username);
	public MyDataResponse getMyDataByToken(String jwtToken);
}