package com.trustping.service;

import org.springframework.security.core.userdetails.UserDetails;

import com.trustping.DTO.DeleteUserDTO;
import com.trustping.DTO.LoginRequestDTO;
import com.trustping.DTO.LoginResponseDTO;
import com.trustping.DTO.MfaRequestDTO;
import com.trustping.DTO.MyDataResponseDTO;
import com.trustping.DTO.OtpResponseDTO;
import com.trustping.DTO.PasswordDTO;
import com.trustping.DTO.SignUpRequestDTO;

public interface UserDataService {
	public boolean duplicateCheckUser(String id);
	public boolean registerUser(SignUpRequestDTO signUpRequestDTO);
	public LoginResponseDTO loginUser(LoginRequestDTO loginRequestDTO);
	public OtpResponseDTO generateGoogleMFA(String jwtToken);
	public boolean verifyGoogleMFA(MfaRequestDTO mfaRequestDTO);
	public UserDetails loadUserByUsername(String username);
	public MyDataResponseDTO getMyDataByToken(String jwtToken);
	public DeleteUserDTO deleteUser(String jwtToken, PasswordDTO passwordDTO);	
}