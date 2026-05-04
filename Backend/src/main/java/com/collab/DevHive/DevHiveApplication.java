package com.collab.DevHive;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DevHiveApplication {

	public static void main(String[] args) {
		SpringApplication.run(DevHiveApplication.class, args);
	}

}
