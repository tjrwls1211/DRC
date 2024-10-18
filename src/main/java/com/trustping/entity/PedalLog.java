package com.trustping.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PedalLog {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long logId;
	private int carId;
	private int aclPedal;
	private int brkPedal;
	@Column(name = "createdAt", columnDefinition = "TIMESTAMP")
	private LocalDateTime createdAt;
	private String driveState;
	
}
