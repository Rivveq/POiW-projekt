package com.casino.project.controller.games;

import com.casino.project.dto.games.SettleRequest;
import com.casino.project.dto.wallet.WalletResponse;
import com.casino.project.service.games.BlackjackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController
@RequestMapping("/api/blackjack")
@RequiredArgsConstructor
public class BlackjackController {

    private final BlackjackService blackjackService;

    @PostMapping("/settle")
    public ResponseEntity<WalletResponse> settle(
            Principal principal,
            @RequestBody SettleRequest request) {
        WalletResponse response = blackjackService.settle(
                principal.getName(),
                request.betAmount(),
                request.winAmount()
        );
        return ResponseEntity.ok(response);
    }
}