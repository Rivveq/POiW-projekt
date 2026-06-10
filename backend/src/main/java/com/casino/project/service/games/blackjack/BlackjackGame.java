package com.casino.project.service.games.blackjack;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Deque;
import java.util.List;

public class BlackjackGame {

    public enum Phase { PLAYER_TURN, FINISHED }

    public static class Hand {
        final List<Card> cards = new ArrayList<>();
        BigDecimal bet;
        boolean done;

        Hand(BigDecimal bet) {
            this.bet = bet;
        }

        public List<Card> cards() { return cards; }
        public BigDecimal bet() { return bet; }
    }

    private static final String[] SUITS = {"♠", "♥", "♦", "♣"};
    private static final String[] VALUES = {"2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"};

    private final Deque<Card> deck = new ArrayDeque<>();
    private final List<Hand> playerHands = new ArrayList<>();
    private final List<Card> dealerCards = new ArrayList<>();
    private int activeHandIndex = 0;
    private Phase phase = Phase.PLAYER_TURN;

    public BlackjackGame(BigDecimal bet, SecureRandom random) {
        buildDeck(random);
        playerHands.add(new Hand(bet));
        activeHand().cards.add(draw());
        dealerCards.add(draw());
        activeHand().cards.add(draw());
        dealerCards.add(draw());

        // Naturalny blackjack: gracz kończy od razu, gra krupier
        if (score(activeHand().cards) == 21) {
            stand();
        }
    }

    private void buildDeck(SecureRandom random) {
        List<Card> cards = new ArrayList<>(52);
        for (String suit : SUITS) {
            for (String value : VALUES) {
                cards.add(new Card(suit, value));
            }
        }
        Collections.shuffle(cards, random);
        deck.addAll(cards);
    }

    public void hit() {
        requirePlayerTurn();
        Hand hand = activeHand();
        hand.cards.add(draw());
        if (score(hand.cards) >= 21) {
            hand.done = true;
            advance();
        }
    }

    public void stand() {
        requirePlayerTurn();
        activeHand().done = true;
        advance();
    }

    public BigDecimal doubleDown() {
        requirePlayerTurn();
        Hand hand = activeHand();
        if (hand.cards.size() != 2) {
            throw new IllegalStateException("Double is only allowed on the first two cards");
        }
        BigDecimal extra = hand.bet;
        hand.bet = hand.bet.add(extra);
        hand.cards.add(draw());
        hand.done = true;
        advance();
        return extra;
    }

    public BigDecimal split() {
        requirePlayerTurn();
        if (playerHands.size() != 1) {
            throw new IllegalStateException("Split is not allowed");
        }
        Hand hand = activeHand();
        if (hand.cards.size() != 2 || hand.cards.get(0).score() != hand.cards.get(1).score()) {
            throw new IllegalStateException("This hand cannot be split");
        }
        BigDecimal extra = hand.bet;
        Hand first = new Hand(hand.bet);
        first.cards.add(hand.cards.get(0));
        first.cards.add(draw());
        Hand second = new Hand(hand.bet);
        second.cards.add(hand.cards.get(1));
        second.cards.add(draw());

        playerHands.clear();
        playerHands.add(first);
        playerHands.add(second);
        activeHandIndex = 0;
        return extra;
    }

    private void advance() {
        for (int i = activeHandIndex + 1; i < playerHands.size(); i++) {
            if (!playerHands.get(i).done) {
                activeHandIndex = i;
                return;
            }
        }
        dealerPlay();
        phase = Phase.FINISHED;
    }

    private void dealerPlay() {
        boolean allBusted = playerHands.stream().allMatch(h -> score(h.cards) > 21);
        if (!allBusted) {
            while (score(dealerCards) < 17) {
                dealerCards.add(draw());
            }
        }
    }

    private Card draw() {
        return deck.pop();
    }

    private void requirePlayerTurn() {
        if (phase != Phase.PLAYER_TURN) {
            throw new IllegalStateException("The round is already finished");
        }
    }

    public boolean canHit() { return phase == Phase.PLAYER_TURN; }

    public boolean canStand() { return phase == Phase.PLAYER_TURN; }

    public boolean canDouble() {
        return phase == Phase.PLAYER_TURN && activeHand().cards.size() == 2;
    }

    public boolean canSplit() {
        if (phase != Phase.PLAYER_TURN || playerHands.size() != 1) return false;
        Hand hand = activeHand();
        return hand.cards.size() == 2 && hand.cards.get(0).score() == hand.cards.get(1).score();
    }

    public Hand activeHand() { return playerHands.get(activeHandIndex); }

    public List<Hand> playerHands() { return playerHands; }

    public List<Card> dealerCards() { return dealerCards; }

    public int activeHandIndex() { return activeHandIndex; }

    public Phase phase() { return phase; }

    public static int score(List<Card> cards) {
        int sum = 0;
        int aces = 0;
        for (Card card : cards) {
            sum += card.score();
            if ("A".equals(card.value())) aces++;
        }
        while (sum > 21 && aces > 0) {
            sum -= 10;
            aces--;
        }
        return sum;
    }
}
