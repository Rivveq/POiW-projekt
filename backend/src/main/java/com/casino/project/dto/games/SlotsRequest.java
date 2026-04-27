package com.casino.project.dto.games;

import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record SlotsRequest(
        @Positive // Blokada przed podaniem negatywnej wartosci beta
        BigDecimal betAmount
) {}