package com.trustping.dto;

import java.time.LocalDateTime;

public class AbnormalDataRequest {
    private Long carId;
    private LocalDateTime createdAt; 


    public AbnormalDataRequest() {
    	super();
    }


    public Long getCarId() {
        return carId;
    }

    public void setCarId(Long carId) {
        this.carId = carId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
