package com.trustping.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.trustping.entity.User;
import com.trustping.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {
	
	@Autowired
	private UserRepository userRepository;
	
	public boolean isUserIdDuplicate(String id) {
	    return userRepository.existsById(id);
	}

	public void signUpUser(User user) {
		userRepository.save(user);
	}

}