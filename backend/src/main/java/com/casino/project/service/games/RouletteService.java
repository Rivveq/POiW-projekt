package com.casino.project.service.games;

import com.casino.project.dto.wallet.WalletResponse;
import com.casino.project.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.*;

@Service
@RequiredArgsConstructor
public class RouletteService {

    private final WalletService walletService;
    private final SecureRandom random = new SecureRandom();

    private static final List<Integer> RED_NUMBERS = Arrays.asList(1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36);
    private static final List<Integer> BLACK_NUMBERS = Arrays.asList(2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35);

    // Historia numerow, do przerzucenia na baze danych
    private final LinkedList<Integer> history = new LinkedList<>();

    @Transactional
    public RouletteResult play(String username, Map<String, Integer> bets) {
        int totalBet = bets.values().stream().mapToInt(Integer::intValue).sum();

        // Pobieranie środków
        walletService.withdraw(username, BigDecimal.valueOf(totalBet));

        // Losowanie
        int winningNumber = random.nextInt(37); // od 0 do 36
        updateHistory(winningNumber);

        // Kalkulacja wygranych
        int totalWin = calculateWinnings(bets, winningNumber);

        // Dopisywanie wygranej
        if (totalWin > 0) {
            walletService.deposit(username, BigDecimal.valueOf(totalWin));
        }

        WalletResponse newBalance = walletService.getBalance(username);

        return new RouletteResult(winningNumber, totalWin, newBalance, new ArrayList<>(history));
    }

    private int calculateWinnings(Map<String, Integer> bets, int result) {
        int totalWin = 0;
        for (Map.Entry<String, Integer> entry : bets.entrySet()) {
            String betKey = entry.getKey();
            int amount = entry.getValue();

            try {
                int numBet = Integer.parseInt(betKey);
                if (numBet == result) totalWin += amount * 36;
            } catch (NumberFormatException e) {
                // Jeśli to nie liczba, sprawdzamy zakłady specjalne
                if ("red".equals(betKey) && RED_NUMBERS.contains(result)) totalWin += amount * 2;
                else if ("black".equals(betKey) && BLACK_NUMBERS.contains(result)) totalWin += amount * 2;
                else if ("even".equals(betKey) && result != 0 && result % 2 == 0) totalWin += amount * 2;
                else if ("odd".equals(betKey) && result != 0 && result % 2 != 0) totalWin += amount * 2;
                else if ("1-18".equals(betKey) && result >= 1 && result <= 18) totalWin += amount * 2;
                else if ("19-36".equals(betKey) && result >= 19 && result <= 36) totalWin += amount * 2;
                else if ("1st12".equals(betKey) && result >= 1 && result <= 12) totalWin += amount * 3;
                else if ("2nd12".equals(betKey) && result >= 13 && result <= 24) totalWin += amount * 3;
                else if ("3rd12".equals(betKey) && result >= 25 && result <= 36) totalWin += amount * 3;
                else if ("col1".equals(betKey) && result != 0 && result % 3 == 1) totalWin += amount * 3;
                else if ("col2".equals(betKey) && result != 0 && result % 3 == 2) totalWin += amount * 3;
                else if ("col3".equals(betKey) && result != 0 && result % 3 == 0) totalWin += amount * 3;
            }
        }
        return totalWin;
    }

    private synchronized void updateHistory(int result) {
        history.addFirst(result);
        if (history.size() > 100) {
            history.removeLast();
        }
    }

    public record RouletteResult(int winningNumber, int totalWin, WalletResponse newBalance, ArrayList<Integer> history) {}
}
