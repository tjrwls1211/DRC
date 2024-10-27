package com.trustping.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.trustping.entity.UserData;

@Repository
public interface UserDataRepository extends JpaRepository<UserData, String> {
    boolean existsById(String id);  
    @Query("SELECT u FROM UserData u WHERE u.id = :id AND u.pw = :pw")
    Optional<UserData> findByIdAndPassword(@Param("id") String id, @Param("pw") String pw);
}
