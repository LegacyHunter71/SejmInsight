package com.parliament.deputy.internal;

import com.parliament.deputy.api.dto.DeputySyncRequest;
import com.parliament.deputy.api.facade.DeputyFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
class DeputyFacadeImpl implements DeputyFacade {
    private final DeputyRepository repository;

    @Override
    public void syncDeputies(List<DeputySyncRequest> requests) {
        Map<Integer, Deputy> existingMap = repository.findAll().stream()
                .collect(Collectors.toMap(Deputy::getId, d -> d));

        List<Deputy> toSave = requests.stream()
                .map(req -> {
                    Deputy deputy = existingMap.getOrDefault(req.id(), createNew(req.id()));
                    updateFields(deputy, req);
                    return deputy;
                }).toList();
        repository.saveAll(toSave);
    }

    private Deputy createNew(Integer id) {
        return Deputy.builder().id(id).totalVotings(0).presentVotings(0).attendanceRate(0.0).build();
    }

    private void updateFields(Deputy deputy, DeputySyncRequest req) {
        deputy.setFirstName(extractFirstName(req.firstLastName()));
        deputy.setLastName(extractLastName(req.firstLastName()));
        deputy.setClub(req.club());
        deputy.setDistrictName(req.districtName());
        deputy.setActive(req.active());
        deputy.setLastSync(LocalDateTime.now());
    }

    private String extractFirstName(String full) {
        return (full == null || !full.contains(" ")) ? full : full.substring(0, full.lastIndexOf(" ")).trim();
    }

    private String extractLastName(String full) {
        return (full == null || !full.contains(" ")) ? "" : full.substring(full.lastIndexOf(" ") + 1).trim();
    }
}
