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
public class DriveLog {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long logId;
	private String carId;
	private int aclPedal;
	private int brkPedal;
	private int speed;
	private int rpm;
	@Column(name = "createdAt", columnDefinition = "TIMESTAMP")
	private LocalDateTime createdAt;
	private String driveState;
	
}
