package com.trustping.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RequestLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long logId;
    private String userId;
    private String method;
    private String uri;
    @Column(name = "createdAt", columnDefinition = "TIMESTAMP")
    private LocalDateTime created_At;
    @PrePersist
    public void prePersist() {
        this.created_At = LocalDateTime.now().withNano(0);
    }

}
