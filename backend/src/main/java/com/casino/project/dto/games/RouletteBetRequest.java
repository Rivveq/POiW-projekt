package com.casino.project.dto.games;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.Map;

public record RouletteBetRequest(
        @NotEmpty
        Map<String, @NotNull @Positive Integer> bets
) {}
