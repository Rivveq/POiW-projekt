package com.casino.project.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class TestController {

    @GetMapping("/status")
    public Map<String, String> getStatus() {
        return Map.of(
                "status", "OK",
                "message", "Backend kasyna wita wariatów!"
        );
    }
}