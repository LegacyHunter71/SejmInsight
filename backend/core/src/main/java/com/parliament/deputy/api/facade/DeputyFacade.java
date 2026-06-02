package com.parliament.deputy.api.facade;

import com.parliament.deputy.api.dto.DeputyListItemDto;
import com.parliament.deputy.api.dto.DeputySyncRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DeputyFacade {

    void syncDeputies(List<DeputySyncRequest> requests);

    void recalculateAttendance();

    Page<DeputyListItemDto> findDeputies(String name, String club, String districtName,
                                         Boolean active, Pageable pageable);
}
