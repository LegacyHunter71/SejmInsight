package com.parliament.internal;

import com.parliament.api.SyncFacade;
import com.parliament.deputy.api.facade.DeputyFacade;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
class SyncFacadeImpl implements SyncFacade {

    private final DeputySyncService deputySyncService;
    private final VotingSyncService votingSyncService;
    private final DeputyFacade deputyFacade;

    @Override
    public void syncAllDeputies() {
        deputySyncService.syncDeputies();
    }

    @Override
    public void syncVotings() {
        votingSyncService.syncLast100Votings();
        log.info("Przeliczam frekwencję posłów...");
        deputyFacade.recalculateAttendance();
        log.info("Frekwencja zaktualizowana.");
    }


}
