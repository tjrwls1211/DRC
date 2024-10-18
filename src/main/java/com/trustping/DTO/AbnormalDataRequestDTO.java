package com.trustping.DTO;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AbnormalDataRequestDTO {
    private Long carId;
    private LocalDateTime createdAt; 

}
