package com.casino.project.controller.games;

import com.casino.project.dto.games.SlotsRequest;
import com.casino.project.service.games.SlotsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/slots")
@RequiredArgsConstructor
public class SlotsController {

    private final SlotsService slotsService;

    @PostMapping("/spin")
    public ResponseEntity<SlotsService.SlotResult> spin(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody SlotsRequest request) {

        // userDetails.getUsername() zwraca login zalogowanego gracza
        SlotsService.SlotResult result = slotsService.spin(userDetails.getUsername(), request.betAmount());

        return ResponseEntity.ok(result);
    }
}
