package com.casino.project.controller.games;

import com.casino.project.dto.games.SlotsRequest;
import com.casino.project.service.games.SlotsService;
import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = SlotsController.class)
@AutoConfigureMockMvc(addFilters = false)
class SlotsControllerTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private SlotsService slotsService;

    @Test
    @WithMockUser(username = "oszust") // Symulujemy zalogowanego gracza
    void shouldBlockNegativeBets() throws Exception {
        // given - gracz podaje ujemny zakład
        SlotsRequest invalidRequest = new SlotsRequest(new BigDecimal("-50.00"));

        // when & then - oczekujemy błędu 400 Bad Request
        mockMvc.perform(post("/api/slots/spin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }
}