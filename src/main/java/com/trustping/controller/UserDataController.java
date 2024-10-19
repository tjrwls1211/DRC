package com.trustping.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trustping.DTO.MfaRequestDTO;
import com.trustping.DTO.OtpDTO;
import com.trustping.DTO.SignInRequestDTO;
import com.trustping.DTO.SignUpRequestDTO;
import com.trustping.service.UserDataService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user")
public class UserDataController {
	@Autowired
	private UserDataService userDataService;

	// ID 중복 확인
	@PostMapping("/check")
	public ResponseEntity<Boolean> idDuplicateCheck(@Valid @RequestParam(name = "id") String id) {
		boolean isDuplicate = userDataService.duplicateCheckUser(id);
		return ResponseEntity.ok(isDuplicate);
	}

	 // 회원 가입
    @PostMapping("/signUp")
    public ResponseEntity<String> signUp(@Valid @RequestBody SignUpRequestDTO signUpRequestDTO) {
        return userDataService.signUpUser(signUpRequestDTO);
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<String> signIn(@Valid @RequestBody SignInRequestDTO signInRequestDTO){
    	boolean isSignedIn =  userDataService.signInUser(signInRequestDTO);
    	 if (isSignedIn) {
             return ResponseEntity.ok("로그인 성공");
         } else {
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패: 아이디 또는 비밀번호가 올바르지 않습니다.");
         }
    }
    
    // Google OTP 인증키, QRLink 생성
    @PostMapping("/otp")
    public ResponseEntity<OtpDTO> otp(@RequestParam(name = "id") String id) {
    	OtpDTO otpDTO = userDataService.generateGoogleMFA(id);
    	return ResponseEntity.ok(otpDTO);
    }
    
    // Google OTP 인증
    @PostMapping("/mfa")
    public ResponseEntity<Boolean> mfa(@RequestBody MfaRequestDTO mfaRequestDTO) {
    	boolean isVerified = userDataService.verifyGoogleMFA(mfaRequestDTO);
    	return ResponseEntity.ok(isVerified);
    }
}
