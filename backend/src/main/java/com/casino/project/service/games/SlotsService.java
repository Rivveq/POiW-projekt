package com.casino.project.service.games;

import com.casino.project.service.WalletService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Collections;
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
        if (roll < 5) return "💎";    // 5%
        if (roll < 15) return "7️⃣";   // 10%
        if (roll < 35) return "🔔";   // 20%
        if (roll < 60) return "🍋";   // 25%
        return "🍒";                  // 40%
    }

    // 1. Zmieniamy definicję linii płatniczych. Używamy współrzędnych [wiersz, kolumna]
    private static final List<List<int[]>> PAYLINES = List.of(
            // Poziome linie
            List.of(new int[]{0,0}, new int[]{0,1}, new int[]{0,2}, new int[]{0,3}, new int[]{0,4}), // Linia 1
            List.of(new int[]{1,0}, new int[]{1,1}, new int[]{1,2}, new int[]{1,3}, new int[]{1,4}), // Linia 2
            List.of(new int[]{2,0}, new int[]{2,1}, new int[]{2,2}, new int[]{2,3}, new int[]{2,4}), // Linia 3
            // Diagonale (w kształcie V i odwróconego V)
            List.of(new int[]{0,0}, new int[]{1,1}, new int[]{2,2}, new int[]{1,3}, new int[]{0,4}), // Linia 4
            List.of(new int[]{2,0}, new int[]{1,1}, new int[]{0,2}, new int[]{1,3}, new int[]{2,4})  // Linia 5
    );

    // 2. Kalkulacja wygranej dla zdefiniowanych linii
    private BigDecimal calculateTotalWin(List<List<String>> grid, BigDecimal betAmount) {
        BigDecimal totalWin = BigDecimal.ZERO;

        for (List<int[]> line : PAYLINES) {
            String firstSymbol = grid.get(line.get(0)[0]).get(line.get(0)[1]);
            int matchCount = 1;

            // Liczymy symbole z rzędu od lewej
            for (int i = 1; i < line.size(); i++) {
                int[] coords = line.get(i);
                if (grid.get(coords[0]).get(coords[1]).equals(firstSymbol)) {
                    matchCount++;
                } else {
                    break;
                }
            }

            if (matchCount >= 3) { // Minimum 3 takie same
                BigDecimal multiplier = getMultiplier(firstSymbol, matchCount);
                if (multiplier.compareTo(BigDecimal.ZERO) > 0) {
                    totalWin = totalWin.add(betAmount.multiply(multiplier));
                }
            }
        }
        return totalWin;
    }

    private BigDecimal getMultiplier(String symbol, int matchCount) {
        return switch (symbol) {
            case "💎" -> new BigDecimal(matchCount == 5 ? "50" : matchCount == 4 ? "15" : "5"); // Za 1 linię
            case "7️⃣" -> new BigDecimal(matchCount == 5 ? "25" : matchCount == 4 ? "8" : "3");
            case "🔔" -> new BigDecimal(matchCount == 5 ? "15" : matchCount == 4 ? "5" : "2");
            case "🍋" -> new BigDecimal(matchCount == 5 ? "10" : matchCount == 4 ? "3" : "1");
            case "🍒" -> new BigDecimal(matchCount == 5 ? "5" : matchCount == 4 ? "2" : "0.5");
            default -> BigDecimal.ZERO;
        };
    }

    @Transactional
    public SlotResult spin(String username, BigDecimal betAmount) {
        walletService.withdraw(username, betAmount);

        // 3. Generujemy siatkę 3x5
        List<List<String>> grid = new ArrayList<>();
        for (int r = 0; r < 3; r++) {
            List<String> row = new ArrayList<>();
            for (int c = 0; c < 5; c++) {
                row.add(drawSymbol());
            }
            grid.add(Collections.unmodifiableList(row));
        }

        // 4. Kalkulujemy total win na podstawie wszystkich linii
        BigDecimal winAmount = calculateTotalWin(grid, betAmount);

        if (winAmount.compareTo(BigDecimal.ZERO) > 0) {
            walletService.deposit(username, winAmount);
        }

        return new SlotResult(winAmount, Collections.unmodifiableList(grid));
    }

    // 5. Aktualizujemy record zwrotny, aby zawierał strukturę siatki
    public record SlotResult(BigDecimal winAmount, List<List<String>> grid) {}
}