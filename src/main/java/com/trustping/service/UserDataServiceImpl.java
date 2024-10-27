package com.trustping.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trustping.DTO.DeleteUserDTO;
import com.trustping.DTO.LoginRequestDTO;
import com.trustping.DTO.LoginResponseDTO;
import com.trustping.DTO.MfaRequestDTO;
import com.trustping.DTO.MyDataResponseDTO;
import com.trustping.DTO.OtpResponseDTO;
import com.trustping.DTO.OtpRequestDTO;
import com.trustping.DTO.SignUpRequestDTO;
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

	private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

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

	// 비밀번호 확인
	public boolean verifyPassword(String rawPassword, String encodedPassword) {
		return passwordEncoder.matches(rawPassword, encodedPassword);
	}

	// 회원가입
	@Override
	@Transactional(rollbackFor = Exception.class)
	public boolean registerUser(SignUpRequestDTO request) {
		if (duplicateCheckUser(request.getId())) {
			return false; // 중복된 ID
		}

		String hashedPassword = passwordEncoder.encode(request.getPw());
		UserData userData = new UserData(request.getId(), hashedPassword, request.getNickname(), request.getBirthDate(),
				request.getCarId(), null, // OTP 키 초기값
				"ROLE_USER");

		userDataRepository.save(userData);
		return true; // 회원가입 성공
	}

	// 로그인
	@Override
	public LoginResponseDTO loginUser(LoginRequestDTO loginRequestDTO) {
		BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
		String id = loginRequestDTO.getId();
		String pw = loginRequestDTO.getPw();
		UserData userData = userDataRepository.findById(id).orElse(null);

		if (userData == null) {
			return new LoginResponseDTO(null, "ID가 존재하지 않습니다.", HttpStatus.UNAUTHORIZED);
		}

		if (!passwordEncoder.matches(pw, userData.getPw())) {
			return new LoginResponseDTO(null, "비밀번호가 일치하지 않습니다.", HttpStatus.UNAUTHORIZED);
		}

		if (userData.getOtpKey() != null) {
			return new LoginResponseDTO(null, "OTP 인증 필요", HttpStatus.OK);
		}

		// JWT 토큰 생성
		String jwtToken = jwtUtil.generateToken(userData.getId());
		return new LoginResponseDTO(jwtToken, "로그인 성공", HttpStatus.OK);
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
		return new org.springframework.security.core.userdetails.User(userData.getId(), userData.getPw(), authorities);
	}

	// Google OTP 생성
	@Transactional(rollbackFor = Exception.class)
	public OtpResponseDTO generateGoogleMFA(OtpRequestDTO otpRequestDTO) {
	    OtpResponseDTO otpDTO = new OtpResponseDTO();

	    try {
	        GoogleAuthenticator googleAuthenticator = new GoogleAuthenticator();
	        GoogleAuthenticatorKey googleAuthenticatorKey = googleAuthenticator.createCredentials();

	        String otpKey = googleAuthenticatorKey.getKey();
	        String QRUrl = GoogleAuthenticatorQRGenerator.getOtpAuthURL("DRC", otpRequestDTO.getId(),
	                googleAuthenticatorKey);

	        UserData userData = userDataRepository.findById(otpRequestDTO.getId())
	                .orElseThrow(() -> new RuntimeException("User not found"));

	        userData.setOtpKey(otpKey);
	        userDataRepository.save(userData);
	        
	        otpDTO.setSuccess(true);
	        otpDTO.setOtpKey(otpKey);
	        otpDTO.setQRUrl(QRUrl);

	    } catch (Exception e) {
	        otpDTO.setSuccess(false); 
	        otpDTO.setOtpKey(null);
	        otpDTO.setQRUrl(null);   
	    }

	    return otpDTO;
	}

	// Google OTP 인증
	@Override
	public boolean verifyGoogleMFA(MfaRequestDTO mfaRequestDTO) {
		GoogleAuthenticator googleAuthenticator = new GoogleAuthenticator();
		String otpKey = getOtpKeyById(mfaRequestDTO.getId());
		boolean verify = googleAuthenticator.authorize(otpKey, mfaRequestDTO.getKey());
		return verify;
	}

	// 마이페이지 데이터 확인
	@Override
	public MyDataResponseDTO getMyDataByToken(String jwtToken) {
		String userId = jwtUtil.extractUsername(jwtToken);

		UserData userData = userDataRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("ID가 존재하지 않습니다: " + userId));

		MyDataResponseDTO data = new MyDataResponseDTO(
				userData.getId(), 
				userData.getNickname(),
				userData.getBirthDate(), 
				userData.getCarId());

		return data;
	}

	// 회원 탈퇴
	@Override
	@Transactional(rollbackFor = Exception.class)
	public DeleteUserDTO deleteUser(LoginRequestDTO loginRequestDTO) {
		String id = loginRequestDTO.getId();
		String pw = loginRequestDTO.getPw();
		UserData userData = userDataRepository.findById(id).orElse(null);
		if (userData == null) {
			return new DeleteUserDTO(false, "ID가 존재하지 않습니다.", HttpStatus.UNAUTHORIZED);
		}
		if (!passwordEncoder.matches(pw, userData.getPw())) {
			return new DeleteUserDTO(false, "비밀번호가 일치하지 않습니다.", HttpStatus.UNAUTHORIZED);
		}
		
		userDataRepository.delete(userData);
		return new DeleteUserDTO(true, "회원 탈퇴 되었습니다.", HttpStatus.OK);
	}
}