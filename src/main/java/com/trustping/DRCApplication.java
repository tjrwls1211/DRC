package com.trustping;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class DRCApplication {
	
	public static void main(String[] args) {
		SpringApplication.run(DRCApplication.class, args);
	}

}
