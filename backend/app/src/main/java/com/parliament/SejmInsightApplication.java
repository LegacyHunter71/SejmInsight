package com.parliament;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication(scanBasePackages = "com.parliament")
public class SejmInsightApplication {

    public static void main(String[] args) {
        SpringApplication.run(SejmInsightApplication.class, args);
    }
}