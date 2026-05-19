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
        // MAGIA: Podmieniamy prawdziwego 'random' na naszego mocka wewnątrz SlotsService
        ReflectionTestUtils.setField(slotsService, "random", secureRandomMock);
    }

    @Test
    void shouldWinJackpotWhenThreeDiamondsAreDrawn() {
        String username = "gracz";
        BigDecimal bet = new BigDecimal("10.00");

        // Zmuszamy maszynę do wygranej (losuje 3 razy to samo)
        when(secureRandomMock.nextInt(100)).thenReturn(2, 3, 4);

        SlotsService.SlotResult result = slotsService.spin(username, bet);

        verify(walletService, times(1)).withdraw(username, bet);
        verify(walletService, times(1)).deposit(username, new BigDecimal("100.00"));
        assertEquals(new BigDecimal("100.00"), result.winAmount());
    }
}