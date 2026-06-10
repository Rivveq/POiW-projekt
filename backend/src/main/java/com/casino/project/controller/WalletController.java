package com.casino.project.controller;

import com.casino.project.dto.wallet.DepositRequest;
import com.casino.project.dto.wallet.WalletResponse;
import com.casino.project.service.WalletService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {
    private final WalletService walletService;

    @GetMapping("/balance")
    public ResponseEntity<WalletResponse> getBalance(Principal principal) {
        return ResponseEntity.ok(walletService.getBalance(principal.getName()));
    }

    @PostMapping("/deposit")
    public ResponseEntity<WalletResponse> deposit(Principal principal,
                                                  @Valid @RequestBody DepositRequest request) {
        return ResponseEntity.ok(walletService.deposit(principal.getName(), request.amount()));
    }
}
