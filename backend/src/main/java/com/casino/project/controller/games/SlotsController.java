package com.casino.project.controller.games;

import com.casino.project.dto.games.SlotsRequest;
import com.casino.project.service.games.SlotsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController
@RequestMapping("/api/slots")
@RequiredArgsConstructor
public class SlotsController {

    private final SlotsService slotsService;

    @PostMapping("/spin")
    public ResponseEntity<SlotsService.SlotResult> spin(
            Principal principal,
            @RequestBody SlotsRequest request) {
        System.out.println("DEBUG: Użytkownik próbujący grać to: " + principal.getName());

        // principal.getName() bezpiecznie wyciąga login (tzw. 'sub') prosto z Twojego tokena JWT
        SlotsService.SlotResult result = slotsService.spin(principal.getName(), request.betAmount());

        return ResponseEntity.ok(result);
    }
}