package com.example.stuCourse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class StuCourseApplication {

	public static void main(String[] args) {
		SpringApplication.run(StuCourseApplication.class, args);
	}
}
