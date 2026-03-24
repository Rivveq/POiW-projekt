package com.casino.project.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Wyłączamy CSRF (ważne przy API i React)
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // Pozwalamy na każdy dostęp bez logowania
                );
        return http.build();
    }
}
