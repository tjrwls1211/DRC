package com.trustping.service;

import java.time.LocalDateTime;

public interface AbnormalDataService {
	Long findSACLByCarIdAndCreatedAt(Long carId, LocalDateTime createdAt);
}
