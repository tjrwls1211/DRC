package com.trustping.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "\"user\"")
public class User {
	
	@Id
	private String id;
	private String pw;
	private String nickname;
	private LocalDateTime birthDate;
	private Long carId;
	
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
	public Long getCarId() {
		return carId;
	}
	public void setCarId(Long carId) {
		this.carId = carId;
	}

}
