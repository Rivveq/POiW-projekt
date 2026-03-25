package com.casino.project.config;

import com.casino.project.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Wyłączamy CSRF (ważne przy API i React)
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // Na razie pozwalamy na każdy dostęp bez logowania
                );
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public org.springframework.security.crypto.password.PasswordEncoder passwordEncoder() {
        return new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
    }

    @Bean
    public org.springframework.security.authentication.AuthenticationProvider authenticationProvider(UserRepository repository) {
        org.springframework.security.authentication.dao.DaoAuthenticationProvider authProvider =
                new org.springframework.security.authentication.dao.DaoAuthenticationProvider();

        authProvider.setUserDetailsService(userDetailsService(repository));
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public org.springframework.security.core.userdetails.UserDetailsService userDetailsService(UserRepository repository) {
        return username -> repository.findByUsername(username)
                .orElseThrow(() -> new org.springframework.security.core.userdetails.UsernameNotFoundException("Nie znaleziono użytkownika: " + username));
    }
}