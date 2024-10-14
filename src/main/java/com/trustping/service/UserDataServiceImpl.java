package com.trustping.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trustping.entity.UserData;
import com.trustping.repository.UserDataRepository;

@Service
public class UserDataServiceImpl implements UserDataService {
	
	@Autowired
	private UserDataRepository userDataRepository;
	
	public boolean isUserIdDuplicate(String id) {
	    return userDataRepository.existsById(id);
	}
	
	@Transactional(rollbackFor = Exception.class)
	public void signUpUser(UserData userData) {
		userDataRepository.save(userData);
	}

}