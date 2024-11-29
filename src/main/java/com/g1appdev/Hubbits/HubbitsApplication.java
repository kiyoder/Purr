package com.g1appdev.Hubbits;

import com.g1appdev.Hubbits.service.UserService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

	@SpringBootApplication
public class HubbitsApplication {

	public static void main(String[] args) {
		SpringApplication.run(HubbitsApplication.class, args);
		System.out.println("Test");
	}


}
