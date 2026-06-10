package com.casino.project.service.games;

import com.casino.project.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SlotsService {
    private final WalletService walletService;
    private final SecureRandom random = new SecureRandom();

    private String drawSymbol() {
        int roll = random.nextInt(1000);
        if (roll < 20) return "WILD";     // 2% szans
        if (roll < 70) return "DIAMOND";  // 5% szans
        if (roll < 170) return "SEVEN";   // 10% szans
        if (roll < 370) return "BELL";    // 20% szans
        if (roll < 620) return "LEMON";   // 25% szans
        return "CHERRY";                  // 38% szans
    }

    private static final List<List<int[]>> PAYLINES = List.of(
            List.of(new int[]{0,0}, new int[]{0,1}, new int[]{0,2}, new int[]{0,3}, new int[]{0,4}),
            List.of(new int[]{1,0}, new int[]{1,1}, new int[]{1,2}, new int[]{1,3}, new int[]{1,4}),
            List.of(new int[]{2,0}, new int[]{2,1}, new int[]{2,2}, new int[]{2,3}, new int[]{2,4}),
            List.of(new int[]{0,0}, new int[]{1,1}, new int[]{2,2}, new int[]{1,3}, new int[]{0,4}),
            List.of(new int[]{2,0}, new int[]{1,1}, new int[]{0,2}, new int[]{1,3}, new int[]{2,4})
    );

    private BigDecimal calculateTotalWin(List<List<String>> grid, BigDecimal betAmount) {
        BigDecimal totalWin = BigDecimal.ZERO;

        for (List<int[]> line : PAYLINES) {
            String firstSymbol = grid.get(line.get(0)[0]).get(line.get(0)[1]);
            if (firstSymbol.equals("WILD")) continue;

            int matchCount = 1;
            for (int i = 1; i < line.size(); i++) {
                int[] coords = line.get(i);
                String currentSymbol = grid.get(coords[0]).get(coords[1]);
                if (currentSymbol.equals(firstSymbol) || currentSymbol.equals("WILD")) {
                    matchCount++;
                } else {
                    break;
                }
            }

            if (matchCount >= 3) {
                BigDecimal multiplier = getMultiplier(firstSymbol, matchCount);
                if (multiplier.compareTo(BigDecimal.ZERO) > 0) {
                    totalWin = totalWin.add(betAmount.multiply(multiplier));
                }
            }
        }
        return totalWin.setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal getMultiplier(String symbol, int matchCount) {
        return switch (symbol) {
            case "DIAMOND" -> new BigDecimal(matchCount == 5 ? "100" : matchCount == 4 ? "25" : "5");
            case "SEVEN" -> new BigDecimal(matchCount == 5 ? "50" : matchCount == 4 ? "15" : "3");
            case "BELL" -> new BigDecimal(matchCount == 5 ? "20" : matchCount == 4 ? "8" : "2");
            case "LEMON" -> new BigDecimal(matchCount == 5 ? "10" : matchCount == 4 ? "4" : "1");
            case "CHERRY" -> new BigDecimal(matchCount == 5 ? "5" : matchCount == 4 ? "2" : "0.5");
            default -> BigDecimal.ZERO;
        };
    }

    @Transactional
    public SlotResult spin(String username, BigDecimal betAmount) {
        walletService.withdraw(username, betAmount);

        List<List<String>> grid = new ArrayList<>();
        for (int r = 0; r < 3; r++) {
            List<String> row = new ArrayList<>();
            for (int c = 0; c < 5; c++) {
                row.add(drawSymbol());
            }
            grid.add(Collections.unmodifiableList(row));
        }

        BigDecimal baseWin = calculateTotalWin(grid, betAmount);

        int globalMultiplier = 1;
        int freeSpinsWon = 0;

        if (baseWin.compareTo(BigDecimal.ZERO) > 0) {
            int bonusRoll = random.nextInt(100);
            if (bonusRoll < 10) globalMultiplier = 5;
            else if (bonusRoll < 30) globalMultiplier = 2;

            if (bonusRoll > 95) freeSpinsWon = 10;
        }

        BigDecimal finalWinAmount = baseWin.multiply(new BigDecimal(globalMultiplier));

        if (finalWinAmount.compareTo(BigDecimal.ZERO) > 0) {
            walletService.deposit(username, finalWinAmount);
        }

        return new SlotResult(finalWinAmount, Collections.unmodifiableList(grid), globalMultiplier, freeSpinsWon);
    }

    public record SlotResult(BigDecimal winAmount, List<List<String>> grid, int multiplier, int freeSpinsWon) {}
}