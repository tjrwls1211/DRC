package com.trustping.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trustping.DTO.MfaRequestDTO;
import com.trustping.DTO.OtpDTO;
import com.trustping.DTO.SignInRequestDTO;
import com.trustping.DTO.SignUpRequestDTO;
import com.trustping.entity.UserData;
import com.trustping.repository.UserDataRepository;
import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import com.warrenstrange.googleauth.GoogleAuthenticatorQRGenerator;

@Service
public class UserDataServiceImpl implements UserDataService {

	@Autowired
	private UserDataRepository userDataRepository;

	// 아이디 조회
	public boolean duplicateCheckUser(String id) {
		return userDataRepository.existsById(id);
	}

	// 비밀번호 조회
	public String getPasswordById(String id) {
		return userDataRepository.findById(id).map(UserData::getPw)
				.orElseThrow(() -> new RuntimeException("ID가 존재하지 않습니다: " + id));
	}

	// otpKey 조회
	public String getOtpKeyById(String id) {
		return userDataRepository.findById(id).map(UserData::getOtpKey)
				.orElseThrow(() -> new RuntimeException("ID가 존재하지 않습니다: " + id));
	}

	// 회원가입
	@Transactional(rollbackFor = Exception.class)
	public ResponseEntity<String> signUpUser(SignUpRequestDTO signUpRequestDTO) {
		// 비밀번호 해시 처리 부분임 - 정상 작동 확인 10.18
		BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
		String hashedPassword = passwordEncoder.encode(signUpRequestDTO.getPw());
		String otpKey = null;

		UserData userData = new UserData(signUpRequestDTO.getId(), hashedPassword, signUpRequestDTO.getNickname(),
				signUpRequestDTO.getBirthDate(), signUpRequestDTO.getCarId(), otpKey);

		if (duplicateCheckUser(userData.getId())) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("회원 가입 실패: 아이디 중복");
		}

		try {
			userDataRepository.save(userData);
			return ResponseEntity.status(HttpStatus.CREATED).body("회원 가입 성공");
		} catch (Exception e) {
			throw new RuntimeException(e.getMessage());
		}
	}

	// 로그인
	public boolean signInUser(SignInRequestDTO signInRequestDTO) {
	    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
	
	    UserData userData = userDataRepository.findById(signInRequestDTO.getId()).orElse(null);
	    if (userData == null) {
	        return false;
	    }
	    
	    if (!passwordEncoder.matches(signInRequestDTO.getPw(), userData.getPw())) {
	        return false;
	    } else {
	    	return true;
	    }
	    
	}


	// Google OTP 생성
	@Transactional(rollbackFor = Exception.class)
	public OtpDTO generateGoogleMFA(String id) {
		GoogleAuthenticator googleAuthenticator = new GoogleAuthenticator();
		GoogleAuthenticatorKey googleAuthenticatorKey = googleAuthenticator.createCredentials();

		String otpKey = googleAuthenticatorKey.getKey();
		String QRUrl = GoogleAuthenticatorQRGenerator.getOtpAuthURL("server", id, googleAuthenticatorKey);
		OtpDTO otpDTO = new OtpDTO(otpKey, QRUrl);

		UserData userData = userDataRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

		userData.setOtpKey(otpKey);
		userDataRepository.save(userData);

		return otpDTO;
	}
	
	// Google OTP 인증
	public boolean verifyGoogleMFA(MfaRequestDTO mfaRequestDTO) {
		GoogleAuthenticator googleAuthenticator = new GoogleAuthenticator();
		String otpKey = getOtpKeyById(mfaRequestDTO.getId());
		boolean verify = googleAuthenticator.authorize(otpKey, mfaRequestDTO.getKey());
		return verify;
	}

}