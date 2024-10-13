package com.trustping.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
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
	
	public PedalLog() {
		super();
	}

	public Long getLogId() {
		return logId;
	}

	public void setLogId(Long logId) {
		this.logId = logId;
	}

	public int getCarId() {
		return carId;
	}

	public void setCarId(int carId) {
		this.carId = carId;
	}

	public int getAclPedal() {
		return aclPedal;
	}

	public void setAclPedal(int aclPedal) {
		this.aclPedal = aclPedal;
	}

	public int getBrkPedal() {
		return brkPedal;
	}

	public void setBrkPedal(int brkPedal) {
		this.brkPedal = brkPedal;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public String getDriveState() {
		return driveState;
	}

	public void setDriveState(String driveState) {
		this.driveState = driveState;
	}
	
}
