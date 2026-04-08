package com.casino.project.service;

import com.casino.project.model.Wallet;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import com.casino.project.repository.WalletRepository;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class WalletService {
    private final WalletRepository walletRepository;

    public WalletService(WalletRepository walletRepository) {
        this.walletRepository = walletRepository;
    }

    public BigDecimal getBalanceByUsername(String username) {
        Wallet wallet = getWalletEntityByUsername(username);

        return wallet.getBalance();
    }
    public Wallet getWalletEntityByUsername(String username) {
        return walletRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono portfela dla użytkownika: " + username));
    }
    @Transactional
    public BigDecimal deposit(BigDecimal amount, String username) {
        Wallet wallet = getWalletEntityByUsername(username);
        wallet.setBalance(wallet.getBalance().add(amount));
        walletRepository.save(wallet);
        return wallet.getBalance();
    }
}
