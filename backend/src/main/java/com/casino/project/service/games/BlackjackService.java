package com.casino.project.service.games;

import com.casino.project.dto.games.BlackjackStateResponse;
import com.casino.project.service.WalletService;
import com.casino.project.service.games.blackjack.BlackjackGame;
import com.casino.project.service.games.blackjack.BlackjackGame.Hand;
import com.casino.project.service.games.blackjack.Card;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class BlackjackService {

    private static final BigDecimal TWO = new BigDecimal("2");
    private static final BigDecimal BLACKJACK = new BigDecimal("2.5");
    private static final Card HIDDEN = new Card("?", "?");

    private final WalletService walletService;
    private final SecureRandom random = new SecureRandom();
    private final ConcurrentHashMap<String, BlackjackGame> games = new ConcurrentHashMap<>();

    @Transactional
    public BlackjackStateResponse start(String username, BigDecimal betAmount) {
        walletService.withdraw(username, betAmount);
        BlackjackGame game = new BlackjackGame(betAmount, random);
        games.put(username, game);
        return afterAction(username, game);
    }

    @Transactional
    public BlackjackStateResponse hit(String username) {
        BlackjackGame game = requireActive(username);
        game.hit();
        return afterAction(username, game);
    }

    @Transactional
    public BlackjackStateResponse stand(String username) {
        BlackjackGame game = requireActive(username);
        game.stand();
        return afterAction(username, game);
    }

    @Transactional
    public BlackjackStateResponse doubleDown(String username) {
        BlackjackGame game = requireActive(username);
        if (!game.canDouble()) {
            throw new IllegalStateException("Double is not allowed now");
        }
        walletService.withdraw(username, game.activeHand().bet());
        game.doubleDown();
        return afterAction(username, game);
    }

    @Transactional
    public BlackjackStateResponse split(String username) {
        BlackjackGame game = requireActive(username);
        if (!game.canSplit()) {
            throw new IllegalStateException("Split is not allowed now");
        }
        walletService.withdraw(username, game.activeHand().bet());
        game.split();
        return afterAction(username, game);
    }

    private BlackjackGame requireActive(String username) {
        BlackjackGame game = games.get(username);
        if (game == null) {
            throw new IllegalStateException("No active blackjack round, start a new game first");
        }
        return game;
    }

    private BlackjackStateResponse afterAction(String username, BlackjackGame game) {
        if (game.phase() == BlackjackGame.Phase.FINISHED) {
            BigDecimal payout = totalPayout(game);
            if (payout.compareTo(BigDecimal.ZERO) > 0) {
                walletService.deposit(username, payout);
            }
            games.remove(username);
        }
        BigDecimal balance = walletService.getBalance(username).balance();
        return buildState(game, balance);
    }

    private BlackjackStateResponse buildState(BlackjackGame game, BigDecimal balance) {
        boolean finished = game.phase() == BlackjackGame.Phase.FINISHED;

        List<List<Card>> playerHands = game.playerHands().stream()
                .map(Hand::cards)
                .map(List::copyOf)
                .toList();
        List<BigDecimal> handBets = game.playerHands().stream().map(Hand::bet).toList();

        List<Card> dealerHand = finished
                ? List.copyOf(game.dealerCards())
                : List.of(game.dealerCards().get(0), HIDDEN);

        List<String> results = new ArrayList<>();
        String message = "";
        if (finished) {
            int dealerScore = BlackjackGame.score(game.dealerCards());
            boolean dealerBlackjack = game.dealerCards().size() == 2 && dealerScore == 21;
            boolean single = game.playerHands().size() == 1;
            for (Hand hand : game.playerHands()) {
                results.add(handResult(hand, dealerScore, dealerBlackjack, single));
            }
            message = buildMessage(results, totalPayout(game), single);
        }

        return new BlackjackStateResponse(
                playerHands,
                dealerHand,
                handBets,
                game.activeHandIndex(),
                game.phase().name(),
                game.canHit(),
                game.canStand(),
                game.canDouble(),
                game.canSplit(),
                message,
                results,
                balance
        );
    }

    private BigDecimal totalPayout(BlackjackGame game) {
        int dealerScore = BlackjackGame.score(game.dealerCards());
        boolean dealerBlackjack = game.dealerCards().size() == 2 && dealerScore == 21;
        boolean single = game.playerHands().size() == 1;
        BigDecimal total = BigDecimal.ZERO;
        for (Hand hand : game.playerHands()) {
            total = total.add(handPayout(hand, dealerScore, dealerBlackjack, single));
        }
        return total;
    }

    private BigDecimal handPayout(Hand hand, int dealerScore, boolean dealerBlackjack, boolean single) {
        int playerScore = BlackjackGame.score(hand.cards());
        boolean playerBlackjack = single && hand.cards().size() == 2 && playerScore == 21;

        if (playerScore > 21) return BigDecimal.ZERO;
        if (playerBlackjack && !dealerBlackjack) return hand.bet().multiply(BLACKJACK);
        if (playerBlackjack) return hand.bet();
        if (dealerBlackjack) return BigDecimal.ZERO;
        if (dealerScore > 21 || playerScore > dealerScore) return hand.bet().multiply(TWO);
        if (playerScore == dealerScore) return hand.bet();
        return BigDecimal.ZERO;
    }

    private String handResult(Hand hand, int dealerScore, boolean dealerBlackjack, boolean single) {
        int playerScore = BlackjackGame.score(hand.cards());
        boolean playerBlackjack = single && hand.cards().size() == 2 && playerScore == 21;

        if (playerScore > 21) return "BUST";
        if (playerBlackjack && !dealerBlackjack) return "BLACKJACK";
        if (playerBlackjack) return "PUSH";
        if (dealerBlackjack) return "LOSE";
        if (dealerScore > 21 || playerScore > dealerScore) return "WIN";
        if (playerScore == dealerScore) return "PUSH";
        return "LOSE";
    }

    private String buildMessage(List<String> results, BigDecimal payout, boolean single) {
        String amount = payout.setScale(2, RoundingMode.HALF_UP).toPlainString();
        if (single) {
            return switch (results.get(0)) {
                case "BLACKJACK" -> "🔥 BLACKJACK! WIN $" + amount + " 🔥";
                case "WIN" -> "YOU WIN $" + amount;
                case "PUSH" -> "PUSH! BET RETURNED.";
                case "BUST" -> "BUST! YOU LOSE.";
                default -> "DEALER WINS.";
            };
        }
        StringBuilder joined = new StringBuilder();
        for (int i = 0; i < results.size(); i++) {
            if (i > 0) joined.append(" | ");
            joined.append("H").append(i + 1).append(": ").append(results.get(i));
        }
        boolean won = payout.compareTo(BigDecimal.ZERO) > 0;
        return joined + (won ? " (WIN $" + amount + ")" : " (LOSE)");
    }
}
