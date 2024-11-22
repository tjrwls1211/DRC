package com.trustping.service;

import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;

import com.trustping.DTO.DriveTimeDTO;
import com.trustping.DTO.LoginRequestDTO;
import com.trustping.DTO.LoginResponseDTO;
import com.trustping.DTO.MfaRequestDTO;
import com.trustping.DTO.MfaResponseDTO;
import com.trustping.DTO.UpdateNicknameDTO;
import com.trustping.DTO.UpdateResponseDTO;
import com.trustping.entity.UserData;
import com.trustping.DTO.MyDataResponseDTO;
import com.trustping.DTO.OtpResponseDTO;
import com.trustping.DTO.PasswordDTO;
import com.trustping.DTO.ResponseDTO;
import com.trustping.DTO.SignUpRequestDTO;

public interface UserDataService {
	public boolean duplicateCheckUser(String id);
	public boolean registerUser(SignUpRequestDTO signUpRequestDTO);
	public LoginResponseDTO loginUser(LoginRequestDTO loginRequestDTO);
	public OtpResponseDTO generateGoogleMFA(String jwtToken);
	public MfaResponseDTO verifyGoogleMFA(MfaRequestDTO mfaRequestDTO);
	public UserDetails loadUserByUsername(String username);
	public MyDataResponseDTO getMyDataByToken(String jwtToken);
	public ResponseDTO deleteUser(String jwtToken, PasswordDTO passwordDTO);	
	public UpdateResponseDTO modifyNickname(String jwtToken, UpdateNicknameDTO modifyNicknameDTO);
	public ResponseDTO verifyPassword(String jwtToken, PasswordDTO passwordDTO);
	public ResponseDTO modifyPassword(String jwtToken, PasswordDTO passwordDTO);
	public String getCarIdById(String id);
	public String getIdByCarId(String carId);
	public ResponseDTO disableMfa(String jwtToken);
	public Optional<UserData> getUserDataById(String id);
	public Optional<UserData> getUserDataByCarId(String carId);
	public DriveTimeDTO getDriveTime(String jwtToken);
}