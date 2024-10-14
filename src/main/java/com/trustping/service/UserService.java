package com.trustping.service;

import com.trustping.entity.User;

public interface UserService {
	public boolean isUserIdDuplicate(String id);
	public void signUpUser(User user);
}