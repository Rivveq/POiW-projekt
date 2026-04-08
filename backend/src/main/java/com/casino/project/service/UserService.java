package com.casino.project.service;

import com.casino.project.model.User;
import com.casino.project.model.Wallet;
import com.casino.project.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }
    @Transactional
    public User registerUser(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Użytkownik o takiej nazwie już istnieje!");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        Wallet wallet = new Wallet();
        wallet.setUser(user);
        user.setWallet(wallet);
        return userRepository.save(user);
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika"));
    }
}