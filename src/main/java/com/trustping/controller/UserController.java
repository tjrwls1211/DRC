package com.trustping.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trustping.entity.User;
import com.trustping.service.UserService;

@RestController
public class UserController {
	
	@Autowired
	private UserService userService;
	
	@PostMapping("/user/check")
	public boolean idDuplicateCheck(String id) {
		return userService.isUserIdDuplicate(id);
	}
	
	@PostMapping("/user/signUp")
	public void signUp(User user) {
		userService.signUpUser(user);
	}
	
}
