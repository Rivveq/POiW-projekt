package com.casino.project.controller;

import com.casino.project.dto.wallet.DepositRequest;
import com.casino.project.dto.wallet.WalletResponse;
import com.casino.project.service.WalletService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @GetMapping("/balance")
    public ResponseEntity<WalletResponse> getBalance(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(walletService.getBalance(userDetails.getUsername()));
    }

    @PostMapping("/deposit")
    public ResponseEntity<WalletResponse> deposit(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody DepositRequest request) {
        return ResponseEntity.ok(walletService.deposit(userDetails.getUsername(), request.amount()));
    }
}