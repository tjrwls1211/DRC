package com.trustping.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.trustping.entity.UserData;

public interface UserDataRepository extends JpaRepository<UserData, String> {
    // ID 중복 확인
    boolean existsById(String id);
}
