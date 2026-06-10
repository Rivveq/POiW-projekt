package com.casino.project.dto.games;

import java.math.BigDecimal;

public record SettleRequest(BigDecimal betAmount, BigDecimal winAmount) {}