package com.parliament.deputy.api.facade;

import com.parliament.deputy.api.dto.DeputySyncRequest;

import java.util.List;

public interface DeputyFacade {
    void syncDeputies(List<DeputySyncRequest> requests);
}
