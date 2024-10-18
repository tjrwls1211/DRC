package com.trustping.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trustping.DTO.SignInRequestDTO;
import com.trustping.DTO.SignUpRequestDTO;
import com.trustping.entity.UserData;
import com.trustping.repository.UserDataRepository;

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
		return userDataRepository.findById(id)
				.map(UserData::getPw) 
				.orElseThrow(() -> new RuntimeException("ID가 존재하지 않습니다: " + id));
	}
	
	// 회원가입
	@Transactional(rollbackFor = Exception.class)
	public ResponseEntity<String> signUpUser(SignUpRequestDTO signUpRequestDTO) {
	   
		// 비밀번호 해시 처리 부분임 - 정상 작동 확인 10.18
		BCryptPasswordEncoder passwordEncoder = new  BCryptPasswordEncoder();
		String hashedPassword = passwordEncoder.encode(signUpRequestDTO.getPw());
		
	    UserData userData = new UserData(
	        signUpRequestDTO.getId(),
	        hashedPassword,
	        signUpRequestDTO.getNickname(),
	        signUpRequestDTO.getBirthDate(),
	        signUpRequestDTO.getCarId()
	    );
		
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
		BCryptPasswordEncoder passwordEncoder = new  BCryptPasswordEncoder();
		
		if (!duplicateCheckUser(signInRequestDTO.getId())) {
			return false;
		} 
		else {
			String storedPassword = getPasswordById(signInRequestDTO.getId());
			return passwordEncoder.matches(signInRequestDTO.getPw(), storedPassword);
		}
		
	}
	
}