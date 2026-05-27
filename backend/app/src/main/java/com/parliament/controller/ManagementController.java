package com.parliament.controller;

import com.parliament.api.SyncFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class ManagementController {

    private final SyncFacade syncFacade;

    @PostMapping("/sync/deputies")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> triggerDeputySync() {
        syncFacade.syncAllDeputies();
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/sync/votings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> triggerVotingSync() {
        syncFacade.syncVotings();
        return ResponseEntity.noContent().build();
    }
}

