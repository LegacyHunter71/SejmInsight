package com.parliament.controller;

import com.parliament.utils.DeputySyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class ManagementController {

    private final DeputySyncService deputySyncService;

    @PostMapping("/sync")
    public ResponseEntity<Void> triggerSync() {
        deputySyncService.syncDeputies();
        return ResponseEntity.noContent().build();
    }
}

