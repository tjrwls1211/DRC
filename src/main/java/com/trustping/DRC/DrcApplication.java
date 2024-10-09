package com.trustping.DRC;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class DrcApplication {
	
	public static void main(String[] args) {
		SpringApplication.run(DrcApplication.class, args);
	}

}
