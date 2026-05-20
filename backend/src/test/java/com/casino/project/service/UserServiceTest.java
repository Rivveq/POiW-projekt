package com.casino.project.service;

import com.casino.project.dto.user.UserRegistrationRequest;
import com.casino.project.exception.UserAlreadyExistsException;
import com.casino.project.model.User;
import com.casino.project.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void shouldThrowExceptionWhenRegisteringExistingUsername() {
        // given
        UserRegistrationRequest request = new UserRegistrationRequest("istniejacy_gracz", "haslo12345");

        when(userRepository.findByUsername("istniejacy_gracz")).thenReturn(Optional.of(new User()));

        // when & then
        assertThrows(UserAlreadyExistsException.class, () -> {
            userService.registerUser(request);
        });
        
        verify(userRepository, never()).save(any(User.class));
    }
}