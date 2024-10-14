package com.trustping.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
public class User {
	
	@Id
	private String id;
	private String pw;
	private String nickname;
	private LocalDateTime birthDate;
	@Column(name="carId",unique = true)
	private int carId;
	
	public String getId() {
		return id;
	}
	
	public void setId(String id) {
		this.id = id;
	}
	public String getPw() {
		return pw;
	}
	public void setPw(String pw) {
		this.pw = pw;
	}
	public String getNickname() {
		return nickname;
	}
	public void setNickname(String nickname) {
		this.nickname = nickname;
	}
	public LocalDateTime getBirthDate() {
		return birthDate;
	}
	public void setBirthDate(LocalDateTime birthDate) {
		this.birthDate = birthDate;
	}
	public int getCarId() {
		return carId;
	}
	public void setCarId(int carId) {
		this.carId = carId;
	}

}
