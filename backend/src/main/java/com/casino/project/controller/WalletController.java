package com.casino.project.controller;

import com.casino.project.service.WalletService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    private final WalletService walletService;

    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    @GetMapping("/balance")
    public ResponseEntity<BigDecimal> getBalance(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        BigDecimal balance = walletService.getBalanceByUsername(username);
        return ResponseEntity.ok(balance);
    }

    @PostMapping("/deposit")
    public ResponseEntity<BigDecimal> deposit(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody DepositRequest request) {
        String username = userDetails.getUsername();
        BigDecimal newBalance = walletService.deposit(request.amount(),  username);
        return ResponseEntity.ok(newBalance);
    }

    public record DepositRequest(BigDecimal amount) {}
}