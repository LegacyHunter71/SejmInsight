package com.parliament.deputy.internal;

import com.parliament.deputy.api.dto.DeputyListItemDto;
import com.parliament.deputy.api.dto.DeputySyncRequest;
import com.parliament.deputy.api.facade.DeputyFacade;
import com.parliament.internal.VoteResultRepository;
import com.parliament.internal.VoteResultRepository.DeputyAttendanceProjection;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
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
    private final VoteResultRepository voteResultRepository;

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

    @Override
    public void recalculateAttendance() {
        Map<Integer, DeputyAttendanceProjection> statsMap = voteResultRepository.findAttendanceStats()
                .stream()
                .collect(Collectors.toMap(DeputyAttendanceProjection::getDeputyId, s -> s));

        List<Deputy> deputies = repository.findAll();
        deputies.forEach(d -> {
            DeputyAttendanceProjection s = statsMap.get(d.getId());
            if (s != null && s.getTotal() > 0) {
                d.setTotalVotings(s.getTotal().intValue());
                d.setPresentVotings(s.getPresentCount().intValue());
                d.setAttendanceRate(s.getPresentCount() * 100.0 / s.getTotal());
            } else {
                d.setTotalVotings(0);
                d.setPresentVotings(0);
                d.setAttendanceRate(0.0);
            }
        });
        repository.saveAll(deputies);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DeputyListItemDto> findDeputies(String name, String club, String districtName,
                                                 Boolean active, Pageable pageable) {
        Specification<Deputy> spec = Specification
                .where(DeputySpecification.nameContains(name))
                .and(DeputySpecification.clubContains(club))
                .and(DeputySpecification.districtContains(districtName))
                .and(DeputySpecification.isActive(active));

        return repository.findAll(spec, pageable).map(this::toListItemDto);
    }

    private DeputyListItemDto toListItemDto(Deputy d) {
        return new DeputyListItemDto(d.getId(), d.getFirstName(), d.getLastName(),
                d.getClub(), d.getDistrictName(), d.getActive(), d.getAttendanceRate(), d.getPresentVotings());
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
