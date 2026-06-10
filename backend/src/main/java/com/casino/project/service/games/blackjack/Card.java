package com.casino.project.service.games.blackjack;

public record Card(String suit, String value) {

    public int score() {
        return switch (value) {
            case "J", "Q", "K" -> 10;
            case "A" -> 11;
            default -> Integer.parseInt(value);
        };
    }
}
