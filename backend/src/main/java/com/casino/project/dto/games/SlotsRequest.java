package com.casino.project.dto.games;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public record SlotsRequest(
        // 0 jest dozwolone dla darmowych spinów (free spins)
        @NotNull @PositiveOrZero
        BigDecimal betAmount
) {}
