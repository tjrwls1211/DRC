package com.trustping.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.trustping.entity.UserData;

public interface UserDataRepository extends JpaRepository<UserData, String> {
    boolean existsById(String id);
    
    @Query("SELECT u FROM UserData u WHERE u.id = :id AND u.pw = :pw")
    Optional<UserData> findByIdAndPassword(@Param("id") String id, @Param("pw") String pw);
}
