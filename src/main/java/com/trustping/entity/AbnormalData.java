package com.trustping.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;

@Entity
public class AbnormalData {
	private String id;
	private LocalDateTime dateTime;
	private int sAcl;
	private int sBrk;
	private int bothPedal;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
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
