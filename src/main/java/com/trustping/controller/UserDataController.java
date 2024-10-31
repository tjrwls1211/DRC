package com.trustping.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trustping.DTO.LoginRequestDTO;
import com.trustping.DTO.LoginResponseDTO;
import com.trustping.DTO.MfaRequestDTO;
import com.trustping.DTO.MfaResponseDTO;
import com.trustping.DTO.ModifyNicknameDTO;
import com.trustping.DTO.ModifyNicknameResponseDTO;
import com.trustping.DTO.MyDataResponseDTO;
import com.trustping.DTO.OtpResponseDTO;
import com.trustping.DTO.PasswordDTO;
import com.trustping.DTO.ResponseDTO;
import com.trustping.DTO.SignUpRequestDTO;
import com.trustping.DTO.TokenValidationDTO;
import com.trustping.security.JwtUtil;
import com.trustping.service.UserDataService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user")
public class UserDataController {

	@Autowired
	private UserDataService userDataService;

	@Autowired
	private JwtUtil jwtUtil;

	// ID 중복 확인
	@GetMapping("/check")
	public ResponseEntity<Boolean> idDuplicateCheck(@RequestParam("id") String id) {
		boolean isDuplicate = userDataService.duplicateCheckUser(id);
		return ResponseEntity.ok(isDuplicate);
	}

	// 회원 가입
	@PostMapping("/signUp")
	public ResponseEntity<ResponseDTO> signUp(@Valid @RequestBody SignUpRequestDTO request) {
		boolean success = userDataService.registerUser(request);
		if (success) {
			return ResponseEntity.ok(new ResponseDTO(true, "회원가입이 성공적으로 완료되었습니다"));
		}
		return ResponseEntity.status(HttpStatus.CONFLICT).body(new ResponseDTO(false, "중복된 ID입니다"));
	}

	// 로그인
	@PostMapping("/login")
	public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginRequestDTO) {
	    LoginResponseDTO response = userDataService.loginUser(loginRequestDTO);

	    switch (response.getLoginStatus()) {
	        case 0:  
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
	        case 1:  
	            return ResponseEntity.status(HttpStatus.OK).body(response);
	        case 2:  
	            return ResponseEntity.ok(response);
	        default:  
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                    .body(new LoginResponseDTO(null, 0, "서버 오류가 발생했습니다"));
	    }
	}


	// Google OTP 인증키, QRLink 생성
	@PostMapping("/otp")
	public ResponseEntity<OtpResponseDTO> generateOtp(@RequestHeader("Authorization") String token) {
		String jwtToken = token.substring(7);
		OtpResponseDTO response = userDataService.generateGoogleMFA(jwtToken);
		if (response.isSuccess()) {
			return ResponseEntity.ok(response);
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}

	// Google OTP 인증
	@PostMapping("/mfa")
	public ResponseEntity<MfaResponseDTO> verifiedMfa(@RequestBody MfaRequestDTO mfaRequestDTO) {
		MfaResponseDTO response = userDataService.verifyGoogleMFA(mfaRequestDTO);
		if (response.isSuccess()) {		
			return ResponseEntity.ok(response);
		} else if ("존재하지 않는 사용자 ID".equals(response.getMessage())) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);

		}
	}

	// 내 정보 확인
	@GetMapping("/myData")
	public ResponseEntity<MyDataResponseDTO> getMyData(@RequestHeader("Authorization") String token) {
		String jwtToken = token.substring(7);
		MyDataResponseDTO data = userDataService.getMyDataByToken(jwtToken);
		return ResponseEntity.ok(data);
	}
	
	// 닉네임 변경
	@PutMapping("/modifyNickname")
	public ResponseEntity<ModifyNicknameResponseDTO> modifyNickName(@RequestHeader("Authorization") String token,@RequestBody ModifyNicknameDTO modifyNicknameDTO){
		String jwtToken = token.substring(7);
		ModifyNicknameResponseDTO response = userDataService.modifyNickname(jwtToken,modifyNicknameDTO);		
		return ResponseEntity.ok(response);
	}
	
	// 비밀번호 인증
	@PostMapping("/verifyPassword")
	public ResponseEntity<ResponseDTO> verifyPassword(@RequestHeader("Authorization") String token, @RequestBody PasswordDTO passwordDTO) {
	    String jwtToken = token.substring(7);
	    ResponseDTO response = userDataService.verifyPassword(jwtToken, passwordDTO);

	    if (response.isSuccess()) {
	        return ResponseEntity.ok(response);
	    } else if ("ID가 존재하지 않습니다".equals(response.getMessage())) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response); 
	    } else {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
	    }
	}
	
	// 회원 탈퇴
	@DeleteMapping("/deleteUser")
	public ResponseEntity<ResponseDTO> deleteUser(@RequestHeader("Authorization") String token, @RequestBody PasswordDTO passwordDTO) {
	    String jwtToken = token.substring(7);
	    ResponseDTO response = userDataService.deleteUser(jwtToken, passwordDTO);

	    if (response.isSuccess()) {
	        return ResponseEntity.ok(response);
	    } else if ("ID가 존재하지 않습니다.".equals(response.getMessage())) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response); 
	    } else {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
	    }
	}


	// JWT 토큰 유효성 검사
	@PostMapping("/validate")
	public ResponseEntity<TokenValidationDTO> validateToken(@RequestHeader(value = "Authorization") String token) {
		String jwtToken = token.substring(7);
		boolean isValid = jwtUtil.validateToken(jwtToken);

		String message = isValid ? "토큰이 유효합니다" : "토큰이 유효하지 않습니다";
		return ResponseEntity.ok(new TokenValidationDTO(isValid, message));
	}
}
