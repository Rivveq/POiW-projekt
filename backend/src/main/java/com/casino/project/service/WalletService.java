package com.casino.project.service;

import com.casino.project.dto.wallet.WalletResponse;
import com.casino.project.model.Wallet;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.casino.project.repository.WalletRepository;

import java.math.BigDecimal;


@Service
@RequiredArgsConstructor
public class WalletService {
    private final WalletRepository walletRepository;

    @Transactional(readOnly = true)
    public WalletResponse getBalance(String username) {
        Wallet wallet = getWalletEntityByUsername(username);
        return new WalletResponse(wallet.getBalance());
    }

    @Transactional
    public WalletResponse deposit(String username, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Value must be greater than zero");
        }

        Wallet wallet = getWalletEntityByUsername(username);
        wallet.setBalance(wallet.getBalance().add(amount));

        return new WalletResponse(wallet.getBalance());
    }

    private Wallet getWalletEntityByUsername(String username) {
        return walletRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
    }
}