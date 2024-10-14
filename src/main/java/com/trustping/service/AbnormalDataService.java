package com.trustping.service;

import java.time.LocalDateTime;

public interface AbnormalDataService {
	int findSACLByCarIdAndCreatedAt(Long carId, LocalDateTime createdAt);
}
