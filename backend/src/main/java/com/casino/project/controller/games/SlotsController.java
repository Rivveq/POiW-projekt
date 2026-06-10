package com.casino.project.controller.games;

import com.casino.project.dto.games.SlotsRequest;
import com.casino.project.service.games.SlotsService;
import jakarta.validation.Valid;
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
            @Valid @RequestBody SlotsRequest request) {
        SlotsService.SlotResult result = slotsService.spin(principal.getName(), request.betAmount());
        return ResponseEntity.ok(result);
    }
}
