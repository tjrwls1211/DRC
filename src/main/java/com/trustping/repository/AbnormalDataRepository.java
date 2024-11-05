package com.trustping.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.trustping.DTO.BothPedalDTO;
import com.trustping.DTO.SAclDTO;
import com.trustping.DTO.SBrkDTO;
import com.trustping.entity.AbnormalData;
import com.trustping.entity.UserData;

@Repository
public interface AbnormalDataRepository extends JpaRepository<AbnormalData, Long> {
    Optional<AbnormalData> findByUserData_UserIdAndDate(String userId, LocalDate date);
    
    List<AbnormalData> findByUserData_UserIdAndDateBetween(String userId, LocalDate startDate, LocalDate endDate);
}
