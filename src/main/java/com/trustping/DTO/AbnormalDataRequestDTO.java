package com.trustping.DTO;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AbnormalDataRequestDTO {
    private Long carId;
    private LocalDate createdAt; 

}
