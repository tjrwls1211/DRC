package com.trustping.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trustping.entity.RequestLog;

public interface RequestLogRepository extends JpaRepository<RequestLog, Long>{
}
