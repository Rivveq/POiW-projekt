package com.casino.project.service.games;

import com.casino.project.service.WalletService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.List;

@Service
public class SlotsService {
    private final WalletService walletService;
    private final SecureRandom random = new SecureRandom();

    public SlotsService(WalletService walletService) {
        this.walletService = walletService;
    }

    private String drawSymbol() {
        int roll = random.nextInt(100);

        if (roll < 5) return "💎";    // 5% szansy
        if (roll < 20) return "🔔";   // 15% szansy
        if (roll < 50) return "🍋";   // 30% szansy
        return "🍒";                  // 50% szansy
    }

    private BigDecimal calculateWin(String s1, String s2, String s3, BigDecimal bet) {
        if (!s1.equals(s2) || !s2.equals(s3)) {
            return BigDecimal.ZERO;
        }

        // Tabela mnożników w zależności od symbolu
        return switch (s1) {
            case "💎" -> bet.multiply(new BigDecimal("10"));
            case "🔔" -> bet.multiply(new BigDecimal("5"));
            case "🍋" -> bet.multiply(new BigDecimal("3"));
            case "🍒" -> bet.multiply(new BigDecimal("2"));
            default -> BigDecimal.ZERO;
        };
    }

    @Transactional
    public SlotResult spin(String username, BigDecimal betAmount) {
        walletService.withdraw(username, betAmount); // Pobieranie stawki z konta gracza

        // Losowanie
        String s1 = drawSymbol();
        String s2 = drawSymbol();
        String s3 = drawSymbol();


        BigDecimal winAmount = calculateWin(s1, s2, s3, betAmount); // Kalkulacja mnożnika
        walletService.deposit(username, winAmount); // Depozyt

        return new SlotResult(List.of(s1, s2, s3), winAmount);
    }

    public record SlotResult(List<String> symbols, BigDecimal winAmount) {}
}