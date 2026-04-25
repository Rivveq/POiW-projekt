package com.casino.project.service;

import com.casino.project.model.User;
import com.casino.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
/*
@Service
public class CasinoService {

    @Autowired
    private UserRepository userRepository;

    public String playDice(String username, Double betAmount) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Użytkownik nie istnieje!"));

        if (user.getBalance() < betAmount) {
            return "Niewystarczające środki!";
        }

        // Rzut kością D6. Jeśli > 3, wygrywasz x2.
        int roll = (int) (Math.random() * 6) + 1;

        if (roll > 3) {
            user.setBalance(user.getBalance() + betAmount);
            userRepository.save(user);
            return "Wygrałeś! Rzut: " + roll + ". Nowy stan konta: " + user.getBalance();
        } else {
            user.setBalance(user.getBalance() - betAmount);
            userRepository.save(user);
            return "Przegrałeś. Rzut: " + roll + ". Nowy stan konta: " + user.getBalance();
        }
    }
}*/