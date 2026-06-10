package com.casino.project.dto.games;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record BlackjackStartRequest(
        @NotNull @Positive
        BigDecimal betAmount
) {}
