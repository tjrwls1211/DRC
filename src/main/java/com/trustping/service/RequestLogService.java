package com.trustping.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.trustping.entity.RequestLog;
import com.trustping.repository.RequestLogRepository;

@Service
public class RequestLogService {
	
	@Autowired
	private RequestLogRepository requestLogRepository;
	

    public RequestLogService(RequestLogRepository requestLogRepository) {
        this.requestLogRepository = requestLogRepository;
    }

    public void saveLog(String userId, String method, String uri) {
        RequestLog log = new RequestLog();
        log.setUserId(userId);
        log.setMethod(method);
        log.setUri(uri);
        requestLogRepository.save(log);
    }
}
