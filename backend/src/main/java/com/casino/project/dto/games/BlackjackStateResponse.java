package com.casino.project.dto.games;

import com.casino.project.service.games.blackjack.Card;

import java.math.BigDecimal;
import java.util.List;

public record BlackjackStateResponse(
        List<List<Card>> playerHands,
        List<Card> dealerHand,
        List<BigDecimal> handBets,
        int activeHandIndex,
        String phase,
        boolean canHit,
        boolean canStand,
        boolean canDouble,
        boolean canSplit,
        String message,
        List<String> results,
        BigDecimal balance
) {}
