package com.casino.project.controller.games;

import com.casino.project.dto.games.BlackjackStartRequest;
import com.casino.project.service.games.BlackjackService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = BlackjackController.class)
@AutoConfigureMockMvc(addFilters = false)
class BlackjackControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private BlackjackService blackjackService;

    @Test
    @WithMockUser(username = "oszust")
    void shouldBlockNegativeBetsInBlackjack() throws Exception {
        // given
        BlackjackStartRequest invalidRequest = new BlackjackStartRequest(new BigDecimal("-500.00"));

        // when & then
        mockMvc.perform(post("/api/blackjack/start")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }
}