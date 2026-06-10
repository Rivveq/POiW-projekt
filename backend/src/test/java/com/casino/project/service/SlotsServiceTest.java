package com.casino.project.service;

import com.casino.project.service.games.SlotsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.security.SecureRandom;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SlotsServiceTest {

    @Mock
    private WalletService walletService;

    @Mock
    private SecureRandom secureRandomMock; // Nasz zmockowany generator

    @InjectMocks
    private SlotsService slotsService; // Automatycznie wstrzykuje WalletService

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(slotsService, "random", secureRandomMock);
    }

    @Test
    void shouldPayMaxWinWhenEveryReelIsDiamond() {
        String username = "gracz";
        BigDecimal bet = new BigDecimal("10.00");

        // drawSymbol() losuje przez nextInt(1000); 20-69 to DIAMOND -> cała siatka w diamentach
        when(secureRandomMock.nextInt(1000)).thenReturn(20);
        // bonusowy rzut przez nextInt(100): 50 -> brak globalnego mnożnika i free spinów
        when(secureRandomMock.nextInt(100)).thenReturn(50);

        // 5 linii wygrywających x (5 symboli DIAMOND -> mnożnik 100) x stawka 10.00 = 5000.00
        BigDecimal expectedWin = new BigDecimal("5000.00");

        SlotsService.SlotResult result = slotsService.spin(username, bet);

        verify(walletService, times(1)).withdraw(username, bet);
        verify(walletService, times(1)).deposit(username, expectedWin);
        assertEquals(expectedWin, result.winAmount());
        assertEquals(1, result.multiplier());
    }
}