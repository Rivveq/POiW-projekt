package com.casino.project.service.games;

import com.casino.project.dto.wallet.WalletResponse;
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
import java.util.Map;

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
        ReflectionTestUtils.setField(rouletteService, "random", secureRandomMock);
    }

    @Test
    void shouldDoubleTheBetWhenWinningOnRed() {
        // given
        String username = "gracz";
        Map<String, Integer> bets = Map.of("red", 50);

        when(secureRandomMock.nextInt(37)).thenReturn(1); // wymuszamy czerwony
        when(walletService.getBalance(username)).thenReturn(new WalletResponse(new BigDecimal("150.00")));

        // when
        RouletteService.RouletteResult result = rouletteService.play(username, bets);

        // then
        verify(walletService, times(1)).withdraw(username, BigDecimal.valueOf(50));

        verify(walletService, times(1)).deposit(username, BigDecimal.valueOf(100));

        assertEquals(1, result.winningNumber());
        assertEquals(100, result.totalWin());
    }
}