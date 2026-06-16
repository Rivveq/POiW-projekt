package com.casino.project.service.games;

import com.casino.project.dto.games.BlackjackStateResponse;
import com.casino.project.dto.wallet.WalletResponse;
import com.casino.project.service.WalletService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BlackjackServiceTest {

    @Mock
    private WalletService walletService;

    @InjectMocks
    private BlackjackService blackjackService;

    @Test
    void shouldProgressThroughBlackjackGamePhases() {
        String username = "gracz";
        BigDecimal bet = new BigDecimal("10.00");

        when(walletService.getBalance(username)).thenReturn(new WalletResponse(new BigDecimal("100.00")));

        BlackjackStateResponse state;

        do {
            state = blackjackService.start(username, bet);
        } while ("FINISHED".equals(state.phase()));

        assertEquals("PLAYER_TURN", state.phase());
        assertTrue(state.canHit());
        assertTrue(state.canStand());

        state = blackjackService.hit(username);

        if ("PLAYER_TURN".equals(state.phase())) {
            state = blackjackService.stand(username);
        }

        assertEquals("FINISHED", state.phase());
        assertFalse(state.canHit());
        assertFalse(state.canStand());
    }
}