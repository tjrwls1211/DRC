package com.trustping.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trustping.entity.User;
import com.trustping.service.UserService;

@RestController
public class UserController {
	
	@Autowired
	private UserService userService;
	
	// 집에서 확인
	@PostMapping("/user/check")
	public boolean idDuplicateCheck(@RequestParam String id) {
		return userService.isUserIdDuplicate(id);
	}
	
	// 집에서 확인
	@PostMapping("/user/signUp")
	public void signUp(@RequestBody User user) {
		userService.signUpUser(user);
	}
	
}
