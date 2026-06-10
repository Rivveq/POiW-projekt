package com.casino.project.controller.games;

import com.casino.project.dto.games.BlackjackStartRequest;
import com.casino.project.dto.games.BlackjackStateResponse;
import com.casino.project.service.games.BlackjackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/blackjack")
@RequiredArgsConstructor
public class BlackjackController {

    private final BlackjackService blackjackService;

    @PostMapping("/start")
    public ResponseEntity<BlackjackStateResponse> start(Principal principal,
                                                        @Valid @RequestBody BlackjackStartRequest request) {
        return ResponseEntity.ok(blackjackService.start(principal.getName(), request.betAmount()));
    }

    @PostMapping("/hit")
    public ResponseEntity<BlackjackStateResponse> hit(Principal principal) {
        return ResponseEntity.ok(blackjackService.hit(principal.getName()));
    }

    @PostMapping("/stand")
    public ResponseEntity<BlackjackStateResponse> stand(Principal principal) {
        return ResponseEntity.ok(blackjackService.stand(principal.getName()));
    }

    @PostMapping("/double")
    public ResponseEntity<BlackjackStateResponse> doubleDown(Principal principal) {
        return ResponseEntity.ok(blackjackService.doubleDown(principal.getName()));
    }

    @PostMapping("/split")
    public ResponseEntity<BlackjackStateResponse> split(Principal principal) {
        return ResponseEntity.ok(blackjackService.split(principal.getName()));
    }
}
