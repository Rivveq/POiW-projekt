package com.casino.project.service;

import com.casino.project.dto.wallet.WalletResponse;
import com.casino.project.model.User;
import com.casino.project.model.Wallet;
import com.casino.project.repository.WalletRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WalletServiceTest {

    @Mock
    private WalletRepository walletRepository;

    @InjectMocks
    private WalletService walletService;

    private Wallet testWallet;
    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setUsername("testUser");

        testWallet = new Wallet();
        testWallet.setUser(testUser);
        testWallet.setBalance(new BigDecimal("100.00"));
    }

    @Test
    void shouldReturnCorrectBalance() {
        // given
        when(walletRepository.findByUserUsername("testUser")).thenReturn(Optional.of(testWallet));

        // when
        WalletResponse response = walletService.getBalance("testUser");

        // then
        assertEquals(new BigDecimal("100.00"), response.balance());
        verify(walletRepository, times(1)).findByUserUsername("testUser");
    }

    @Test
    void shouldDepositMoneySuccessfully() {
        // given
        when(walletRepository.findByUserUsername("testUser")).thenReturn(Optional.of(testWallet));
        BigDecimal depositAmount = new BigDecimal("50.00");

        // when
        WalletResponse response = walletService.deposit("testUser", depositAmount);

        // then
        assertEquals(new BigDecimal("150.00"), response.balance());
        assertEquals(new BigDecimal("150.00"), testWallet.getBalance());
    }

    @Test
    void shouldThrowExceptionWhenDepositAmountIsNegative() {
        // given
        BigDecimal invalidAmount = new BigDecimal("-10.00");

        // when & then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            walletService.deposit("testUser", invalidAmount);
        });

        assertEquals("Value must be greater than zero", exception.getMessage());
        verify(walletRepository, never()).findByUserUsername(anyString());
    }
}