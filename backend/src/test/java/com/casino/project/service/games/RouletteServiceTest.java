package com.casino.project.service.games;

import com.casino.project.service.WalletService;
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
class RouletteServiceTest {

    @Mock
    private WalletService walletService;

    @Mock
    private SecureRandom secureRandomMock;

    @InjectMocks
    private RouletteService rouletteService;

    @BeforeEach
    void setUp() {
        // "Hakujemy" prywatną maszynę losującą w RouletteService
        ReflectionTestUtils.setField(rouletteService, "random", secureRandomMock);
    }

    @Test
    void shouldDoubleTheBetWhenWinningOnRed() {
        // given
        String username = "gracz";
        BigDecimal bet = new BigDecimal("50.00");

        when(secureRandomMock.nextInt(37)).thenReturn(1); // wymuszamy czerwony

        // when
        RouletteService.RouletteResult result = rouletteService.play(username, bet, "RED", null);

        // then
        verify(walletService, times(1)).withdraw(username, bet);

        BigDecimal expectedWin = new BigDecimal("100.00");
        verify(walletService, times(1)).deposit(username, expectedWin);

        assertEquals("RED", result.color());
        assertEquals(expectedWin, result.winAmount());
    }
}