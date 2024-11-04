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

@Repository
public interface AbnormalDataRepository extends JpaRepository<AbnormalData, Long> {
	
	@Query("SELECT new com.trustping.DTO.SAclDTO(a.sAcl) FROM AbnormalData a WHERE a.carId = :carId AND a.date = :date")
    Optional<SAclDTO> findSAclByCarIdAndDate(@Param("carId") String carId, @Param("date") LocalDate date);

    @Query("SELECT new com.trustping.DTO.SBrkDTO(a.sBrk) FROM AbnormalData a WHERE a.carId = :carId AND a.date = :date")
    Optional<SBrkDTO> findSBrkByCarIdAndDate(@Param("carId") String carId, @Param("date") LocalDate date);

    @Query("SELECT new com.trustping.DTO.BothPedalDTO(a.bothPedal) FROM AbnormalData a WHERE a.carId = :carId AND a.date = :date")
    Optional<BothPedalDTO> findBothPedalByCarIdAndDate(@Param("carId") String carId, @Param("date") LocalDate date);
	
	Optional<AbnormalData> findByCarIdAndDate(@Param("carId") String carId, @Param("date") LocalDate date);
	
	List<AbnormalData> findByCarIdAndDateBetween(String carId, LocalDate startDate, LocalDate endDate);	
}
