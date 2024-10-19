package com.trustping.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
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
public class AbnormalData {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long logId;
	private int carId;
	@Column(columnDefinition = "TIMESTAMP")
	private LocalDate date;
	private int sAcl;
	private int sBrk;
	private int bothPedal;
	
}
