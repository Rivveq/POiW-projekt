package com.casino.project.service.games;

import com.casino.project.dto.wallet.WalletResponse;
import com.casino.project.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class BlackjackService {

    private final WalletService walletService;

    @Transactional
    public WalletResponse settle(String username, BigDecimal betAmount, BigDecimal winAmount) {
        walletService.withdraw(username, betAmount);

        if (winAmount.compareTo(BigDecimal.ZERO) > 0) {
            return walletService.deposit(username, winAmount);
        }

        return walletService.getBalance(username);
    }
}