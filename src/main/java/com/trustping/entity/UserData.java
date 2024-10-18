package com.trustping.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserData {	
	@Id
	private String id;
	private String pw;
	private String nickname;
	private LocalDate birthDate;
	private Long carId;
	private String otpKey;
}
