package com.casino.project.controller.games;

import com.casino.project.dto.games.RouletteBetRequest;
import com.casino.project.service.games.RouletteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/roulette")
@RequiredArgsConstructor
public class RouletteController {

    private final RouletteService rouletteService;

    @PostMapping("/bet")
    public ResponseEntity<RouletteService.RouletteResult> placeBet(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody RouletteBetRequest request) {

        return ResponseEntity.ok(rouletteService.play(
                userDetails.getUsername(),
                request.amount(),
                request.type(),
                request.value()
        ));
    }
}
