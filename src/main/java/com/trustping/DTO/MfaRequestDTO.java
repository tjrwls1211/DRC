package com.trustping.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MfaRequestDTO {
	@NotBlank(message = "아이디(Email) 입력")
	private String id;
	@Positive
	private int key;
}
