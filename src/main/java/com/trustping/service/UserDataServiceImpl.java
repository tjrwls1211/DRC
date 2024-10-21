package com.trustping.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trustping.DTO.LoginRequestDTO;
import com.trustping.DTO.MfaRequestDTO;
import com.trustping.DTO.OtpDTO;
import com.trustping.DTO.OtpRequestDTO;
import com.trustping.DTO.SignUpRequestDTO;
import com.trustping.DTO.SignUpResponseDTO;
import com.trustping.entity.UserData;
import com.trustping.repository.UserDataRepository;
import com.trustping.security.JwtUtil;
import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import com.warrenstrange.googleauth.GoogleAuthenticatorQRGenerator;

@Service
public class UserDataServiceImpl implements UserDataService {

	@Autowired
	private UserDataRepository userDataRepository;

    @Autowired
    private JwtUtil jwtUtil; // JWT 유틸리티 클래스 주입

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
	@Override
	@Transactional(rollbackFor = Exception.class)
	public ResponseEntity<SignUpResponseDTO> signUpUser(SignUpRequestDTO signUpRequestDTO) {
	    // 비밀번호 해시 처리 부분
	    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
	    String hashedPassword = passwordEncoder.encode(signUpRequestDTO.getPw());
	    String otpKey = null;
	    String userRole = "ROLE_USER";

	    UserData userData = new UserData(signUpRequestDTO.getId(), hashedPassword, signUpRequestDTO.getNickname(),
	            signUpRequestDTO.getBirthDate(), signUpRequestDTO.getCarId(), otpKey, userRole);

	    // 중복 체크
	    if (duplicateCheckUser(userData.getId())) {
	        return ResponseEntity.ok(new SignUpResponseDTO(false, "중복된 ID입니다.")); // 중복된 ID가 있을 경우 false 반환
	    }

	    try {
	        userDataRepository.save(userData);
	        return ResponseEntity.ok(new SignUpResponseDTO(true, "회원가입이 성공적으로 완료되었습니다.")); // 회원가입 성공 시 true 반환
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                             .body(new SignUpResponseDTO(false, "회원가입 중 오류가 발생했습니다.")); // 오류 발생 시 false 반환
	    }
	}

	 // 로그인
	@Override
    public ResponseEntity<String> LoginUser(LoginRequestDTO signInRequestDTO) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        UserData userData = userDataRepository.findById(signInRequestDTO.getId()).orElse(null);
        if (userData == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("ID가 존재하지 않습니다.");
        }

        if (!passwordEncoder.matches(signInRequestDTO.getPw(), userData.getPw())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 일치하지 않습니다.");
        }

        // JWT 토큰 생성
        String jwtToken = jwtUtil.generateToken(userData.getId());
        return ResponseEntity.ok(jwtToken);
    }
    
	// 유저 필터 추가
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
	    // 사용자 정보를 데이터베이스에서 조회
	    UserData userData = userDataRepository.findById(username)
	        .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + username));
	    
	    // 권한 리스트 생성 및 추가
	    List<GrantedAuthority> authorities = new ArrayList<>();
	    authorities.add(new SimpleGrantedAuthority(userData.getRole()));

	    // UserDetails 객체 반환
	    return new org.springframework.security.core.userdetails.User(
	        userData.getId(),
	        userData.getPw(),
	        authorities 
	    );
	}


	// Google OTP 생성
	@Transactional(rollbackFor = Exception.class)
	public OtpDTO generateGoogleMFA(OtpRequestDTO otpRequestDTO) {
		GoogleAuthenticator googleAuthenticator = new GoogleAuthenticator();
		GoogleAuthenticatorKey googleAuthenticatorKey = googleAuthenticator.createCredentials();

		String otpKey = googleAuthenticatorKey.getKey();
		String QRUrl = GoogleAuthenticatorQRGenerator.getOtpAuthURL("server", otpRequestDTO.getId(), googleAuthenticatorKey);
		OtpDTO otpDTO = new OtpDTO(otpKey, QRUrl);

		UserData userData = userDataRepository.findById(otpRequestDTO.getId()).orElseThrow(() -> new RuntimeException("User not found"));

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