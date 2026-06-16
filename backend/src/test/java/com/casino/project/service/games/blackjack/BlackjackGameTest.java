package com.casino.project.service.games.blackjack;

import org.junit.jupiter.api.Test;
import java.util.List;
import static org.junit.jupiter.api.Assertions.assertEquals;

class BlackjackGameTest {

    @Test
    void shouldCalculateScoreCorrectly() {
        // given
        Card king = new Card("♠", "K");   // Wartość: 10
        Card five = new Card("♥", "5");   // Wartość: 5
        Card ace1 = new Card("♦", "A");   // Wartość: 11 lub 1
        Card ace2 = new Card("♣", "A");   // Wartość: 11 lub 1

        // when & then
        assertEquals(15, BlackjackGame.score(List.of(king, five)));

        assertEquals(21, BlackjackGame.score(List.of(king, ace1)));

        assertEquals(16, BlackjackGame.score(List.of(king, five, ace1)));

        assertEquals(12, BlackjackGame.score(List.of(ace1, ace2)));
    }
}