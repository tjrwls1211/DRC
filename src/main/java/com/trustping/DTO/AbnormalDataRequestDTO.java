package com.trustping.DTO;

import java.time.LocalDateTime;

public class AbnormalDataRequestDTO {
    private Long carId;
    private LocalDateTime createdAt; 

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
