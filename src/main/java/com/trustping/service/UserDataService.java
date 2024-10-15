package com.trustping.service;

import org.springframework.http.ResponseEntity;

import com.trustping.entity.UserData;

public interface UserDataService {
	public boolean duplicateCheckUser(String id);
	public ResponseEntity<String> registerUser(UserData userData);
}