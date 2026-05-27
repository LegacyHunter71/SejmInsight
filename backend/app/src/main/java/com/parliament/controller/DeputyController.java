package com.parliament.controller;

import com.parliament.api.VotingDto;
import com.parliament.api.VotingFacade;
import com.parliament.deputy.api.dto.DeputyListItemDto;
import com.parliament.deputy.api.facade.DeputyFacade;
import com.parliament.enums.VoteKind;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/deputies")
@RequiredArgsConstructor
class DeputyController {

    private final DeputyFacade deputyFacade;
    private final VotingFacade votingFacade;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'CITIZEN')")
    public Page<DeputyListItemDto> getDeputies(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String club,
            @RequestParam(required = false) String districtName,
            @RequestParam(required = false) Boolean active,
            @PageableDefault(size = 20, sort = "lastName") Pageable pageable) {
        return deputyFacade.findDeputies(name, club, districtName, active, pageable);
    }

    @GetMapping("/{deputyId}/votings")
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'CITIZEN')")
    public Page<VotingDto> getDeputyVotings(
            @PathVariable Integer deputyId,
            @RequestParam(required = false) VoteKind vote,
            @RequestParam(required = false) String title,
            @PageableDefault(size = 20, sort = "proceedingNo", direction = Sort.Direction.DESC) Pageable pageable) {
        return votingFacade.getDeputyVotings(deputyId, vote, title, pageable);
    }
}
