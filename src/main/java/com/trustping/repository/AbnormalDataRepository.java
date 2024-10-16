package com.trustping.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.trustping.DTO.BothPedalDTO;
import com.trustping.DTO.SAclDTO;
import com.trustping.DTO.SBrkDTO;
import com.trustping.entity.AbnormalData;

public interface AbnormalDataRepository extends JpaRepository<AbnormalData, Long> {
    @Query("SELECT new com.trustping.DTO.SAclDTO(a.sAcl) FROM AbnormalData a WHERE a.carId = :carId AND a.dateTime = :dateTime")
    Optional<SAclDTO> findSAclByCarIdAndDate(@Param("carId") int carId, @Param("dateTime") LocalDateTime dateTime);

    @Query("SELECT new com.trustping.DTO.SBrkDTO(a.sBrk) FROM AbnormalData a WHERE a.carId = :carId AND a.dateTime = :dateTime")
    Optional<SBrkDTO> findSBrkByCarIdAndDate(@Param("carId") int carId, @Param("dateTime") LocalDateTime dateTime);

    @Query("SELECT new com.trustping.DTO.BothPedalDTO(a.bothPedal) FROM AbnormalData a WHERE a.carId = :carId AND a.dateTime = :dateTime")
    Optional<BothPedalDTO> findBothPedalByCarIdAndDate(@Param("carId") int carId, @Param("dateTime") LocalDateTime dateTime);

}
