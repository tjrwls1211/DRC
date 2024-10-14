package com.trustping.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trustping.entity.User;

public interface UserRepository extends JpaRepository<User, String>{
	boolean existById(String id);
}
