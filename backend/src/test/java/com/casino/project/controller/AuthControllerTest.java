package com.casino.project.controller;

import com.casino.project.dto.auth.LoginResponse;
import com.casino.project.dto.user.UserLoginRequest;
import com.casino.project.dto.user.UserRegistrationRequest;
import com.casino.project.dto.user.UserResponse;
import com.casino.project.service.AuthService;
import com.casino.project.service.UserService;
import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.*;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = AuthController.class)
@AutoConfigureMockMvc(addFilters = false) // Wyłącza filtry Security na potrzeby testu kontrolera
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private AuthService authService;

    @Test
    void shouldRegisterUserSuccessfully() throws Exception {
        // given
        UserRegistrationRequest request = new UserRegistrationRequest("nowy_gracz", "trudneHaslo123");
        UserResponse mockResponse = new UserResponse(1L, "nowy_gracz", "USER");

        when(userService.registerUser(any(UserRegistrationRequest.class))).thenReturn(mockResponse);

        // when & then
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username").value("nowy_gracz"))
                .andExpect(jsonPath("$.role").value("USER"));
    }

    @Test
    void shouldLoginUserAndReturnToken() throws Exception {
        // given
        UserLoginRequest loginRequest = new UserLoginRequest("gracz", "haslo");

        String mockToken = "mockowany.jwt.token";
        UserResponse mockUser = new UserResponse(1L, "gracz", "USER");

        LoginResponse mockResponse = new LoginResponse(mockToken, mockUser);

        when(authService.login("gracz", "haslo")).thenReturn(mockResponse);

        // when & then
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value(mockToken))
                .andExpect(jsonPath("$.user.username").value("gracz"));
    }

    @Test
    void shouldReturnBadRequestWhenRegistrationDataIsInvalid() throws Exception {

        // given
        UserRegistrationRequest invalidRequest = new UserRegistrationRequest("", "123");

        // when & then
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }
}