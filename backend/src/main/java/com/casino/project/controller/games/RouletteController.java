package com.casino.project.controller.games;

import com.casino.project.dto.games.RouletteBetRequest;
import com.casino.project.service.games.RouletteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/roulette")
@RequiredArgsConstructor
public class RouletteController {

    private final RouletteService rouletteService;

    @PostMapping("/bet")
    public ResponseEntity<RouletteService.RouletteResult> placeBet(
            Principal principal,
            @Valid @RequestBody RouletteBetRequest request) {
        return ResponseEntity.ok(rouletteService.play(
                principal.getName(),
                request.bets()
        ));
    }
}
