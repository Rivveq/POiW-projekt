package com.casino.project.dto.games;

import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record RouletteBetRequest(
        @Positive // Blokada przed podaniem negatywnej wartosci beta
        BigDecimal amount,

        String type, // np. "RED", "BLACK", "NUMBER"
        Integer value // np. 17 (jeśli typ to NUMBER)
) {}
