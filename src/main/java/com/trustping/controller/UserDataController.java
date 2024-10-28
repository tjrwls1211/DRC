package com.trustping.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trustping.DTO.DeleteUserDTO;
import com.trustping.DTO.LoginRequestDTO;
import com.trustping.DTO.LoginResponseDTO;
import com.trustping.DTO.MfaRequestDTO;
import com.trustping.DTO.MfaResponseDTO;
import com.trustping.DTO.MyDataResponseDTO;
import com.trustping.DTO.OtpRequestDTO;
import com.trustping.DTO.OtpResponseDTO;
import com.trustping.DTO.SignUpRequestDTO;
import com.trustping.DTO.SignUpResponseDTO;
import com.trustping.service.UserDataService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user")
public class UserDataController {
	@Autowired
	private UserDataService userDataService;

	// ID 중복 확인
	@GetMapping("/check")
	public ResponseEntity<Boolean> idDuplicateCheck(@RequestParam("id") String id) {
		boolean isDuplicate = userDataService.duplicateCheckUser(id);
		return ResponseEntity.ok(isDuplicate);
	}

	// 회원 가입
	@PostMapping("/signUp")
	public ResponseEntity<SignUpResponseDTO> signUp(@Valid @RequestBody SignUpRequestDTO request) {
		boolean success = userDataService.registerUser(request);
		if (success) {
			return ResponseEntity.ok(new SignUpResponseDTO(true, "회원가입이 성공적으로 완료되었습니다."));
		}
		return ResponseEntity.status(HttpStatus.CONFLICT).body(new SignUpResponseDTO(false, "중복된 ID입니다."));
	}

	// 로그인
	@PostMapping("/login")
	public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginRequestDTO) {
		LoginResponseDTO response = userDataService.loginUser(loginRequestDTO);
		return ResponseEntity.status(response.getStatus()).body(response);
	}

	// Google OTP 인증키, QRLink 생성
	@PostMapping("/otp")
	public ResponseEntity<OtpResponseDTO> generateOtp(@RequestHeader("Authorization") String token) {
	    try {
	    	System.out.println(token);
	    	String jwtToken = token.substring(7);
			OtpResponseDTO otpResponse = userDataService.generateGoogleMFA(jwtToken);
	        if (otpResponse.isSuccess()) {
	            return ResponseEntity.ok(otpResponse);
	        } else {
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR) 
	                    .body(otpResponse);
	        }
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR) 
	                .body(new OtpResponseDTO(false, null, null)); // 실패 응답 반환
	    }
	}

	// Google OTP 인증
	@PostMapping("/mfa")
	public ResponseEntity<MfaResponseDTO> verifiedMfa(@RequestBody MfaRequestDTO mfaRequestDTO) {
		boolean success = userDataService.verifyGoogleMFA(mfaRequestDTO);
		if (success) {
			return ResponseEntity.ok(new MfaResponseDTO(true, "2차 인증에 성공했습니다."));
		}
		return ResponseEntity.status(HttpStatus.CONFLICT).body(new MfaResponseDTO(false, "2차 인증에 실패했습니다."));
	}

	// 내 정보 확인
	@GetMapping("/myData")
	public ResponseEntity<MyDataResponseDTO> getMydata(@RequestHeader("Authorization") String token) {
		try {
			String jwtToken = token.substring(7);
			MyDataResponseDTO data = userDataService.getMyDataByToken(jwtToken);
			return ResponseEntity.ok(data);
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}
	
	// 회원 탈퇴
	@PostMapping("/deleteUser")
	public ResponseEntity<DeleteUserDTO> deleteUser(@RequestBody LoginRequestDTO loginRequestDTO){
		DeleteUserDTO response = userDataService.deleteUser(loginRequestDTO);
		return ResponseEntity.status(response.getStatus()).body(response);
	}
	
}
