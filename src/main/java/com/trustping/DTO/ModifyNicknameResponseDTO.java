package com.trustping.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ModifyNicknameResponseDTO {
	private boolean success;
    private String message;
    private String newNickname;
}
