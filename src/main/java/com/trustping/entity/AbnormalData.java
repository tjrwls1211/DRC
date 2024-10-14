package com.trustping.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
public class AbnormalData {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long logId;
	@Column(name = "carId",unique=true)
	private Long carId;
	@Column(name = "createdAt", columnDefinition = "TIMESTAMP")
	private LocalDateTime createdAt;
	private int sAcl;
	private int sBrk;
	private int bothPedal;
	
	
	public Long getLogId() {
		return logId;
	}
	public void setLogId(Long logId) {
		this.logId = logId;
	}
	public Long getCarId() {
		return carId;
	}
	public void setCarId(Long carId) {
		this.carId = carId;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	public int getsAcl() {
		return sAcl;
	}
	public void setsAcl(int sAcl) {
		this.sAcl = sAcl;
	}
	public int getsBrk() {
		return sBrk;
	}
	public void setsBrk(int sBrk) {
		this.sBrk = sBrk;
	}
	public int getBothPedal() {
		return bothPedal;
	}
	public void setBothPedal(int bothPedal) {
		this.bothPedal = bothPedal;
	}
	
}
