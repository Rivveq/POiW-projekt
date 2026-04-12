package com.casino.project.dto.wallet;

import java.math.BigDecimal;

public record WalletResponse(
        BigDecimal balance
) {}