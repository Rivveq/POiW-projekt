package com.casino.project.service.games;

import com.casino.project.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class RouletteService {

    private final WalletService walletService;
    private final SecureRandom random = new SecureRandom();

    @Transactional
    public RouletteResult play(String username, BigDecimal amount, String betType, Integer chosenValue) {
        // Pobieranie stawki z portfela
        walletService.withdraw(username, amount);

        // Losowanie liczby (0-36)
        int winningNumber = random.nextInt(37);
        String color = getNumberColor(winningNumber);

        // Sprawdzanie wygranej
        BigDecimal multiplier = BigDecimal.ZERO;

        if (betType.equals("NUMBER") && chosenValue == winningNumber) {
            multiplier = new BigDecimal("36"); // Wygrana za numer: x36
        } else if (betType.equals("RED") && color.equals("RED")) {
            multiplier = new BigDecimal("2");  // Wygrana za kolor: x2
        } else if (betType.equals("BLACK") && color.equals("BLACK")) {
            multiplier = new BigDecimal("2");
        }

        BigDecimal winAmount = amount.multiply(multiplier);
        if (winAmount.compareTo(BigDecimal.ZERO) > 0) {
            walletService.deposit(username, winAmount);
        }

        return new RouletteResult(winningNumber, color, winAmount);
    }

    // Zdefiniowana stała tablica czerwonych numerow
    private static final Set<Integer> RED_NUMBERS = Set.of(
            1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36
    );

    private String getNumberColor(int number) {
        if (number == 0) return "GREEN";
        return RED_NUMBERS.contains(number) ? "RED" : "BLACK";
    }

    public record RouletteResult(int number, String color, BigDecimal winAmount) {}
}
