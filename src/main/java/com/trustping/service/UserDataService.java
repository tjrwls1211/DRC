package com.trustping.service;

import com.trustping.entity.UserData;

public interface UserDataService {
	public boolean isUserIdDuplicate(String id);
	public void signUpUser(UserData userData);
}