package com.casino.project.dto.wallet;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record DepositRequest(
        @NotNull @Positive(message = "Amount must be greater than zero")
        BigDecimal amount
) {}