package com.trustping.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class AbnormalData {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long logId;
	private int carId;
	@Column(columnDefinition = "TIMESTAMP")
	private LocalDateTime dateTime;
	private int sAcl;
	private int sBrk;
	private int bothPedal;
	
	
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
	public LocalDateTime getDateTime() {
		return dateTime;
	}
	public void setDateTime(LocalDateTime dateTime) {
		this.dateTime = dateTime;
	}
	public int getsAcl() {
		return sAcl;
	}
	public void setSAcl(int sAcl) {
		this.sAcl = sAcl;
	}
	public int getSBrk() {
		return sBrk;
	}
	public void setSBrk(int sBrk) {
		this.sBrk = sBrk;
	}
	public int getBothPedal() {
		return bothPedal;
	}
	public void setBothPedal(int bothPedal) {
		this.bothPedal = bothPedal;
	}
	
}
