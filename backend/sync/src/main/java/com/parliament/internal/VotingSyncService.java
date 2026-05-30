package com.parliament.internal;

import com.parliament.api.VoteSyncItem;
import com.parliament.api.VotingFacade;
import com.parliament.api.VotingSyncRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class VotingSyncService {

    private final RestClient restClient;
    private final VotingFacade votingFacade;

    @Value("${parliament.term}")
    private String apiTerm;

    public void syncLast100Votings() {
        log.info("Rozpoczynam bezpieczną synchronizację ostatnich 100 głosowań...");
        try {

            List<ProceedingDto> proceedings = restClient.get()
                    .uri(apiTerm + "/votings")
                    .retrieve()
                    .body(new ParameterizedTypeReference<List<ProceedingDto>>() {});

            if (proceedings == null || proceedings.isEmpty()) {
                log.warn("API Sejmu zwróciło pustą listę posiedzeń.");
                return;
            }

            List<FlatVotingReference> allVotings = proceedings.stream()
                    .filter(p -> p.proceedingNo() != null && p.votings() != null)
                    .flatMap(p -> p.votings().stream()
                            .filter(v -> v.votingNo() != null)
                            .map(v -> new FlatVotingReference(p.proceedingNo(), v.votingNo())))
                    .collect(Collectors.toList());

            if (allVotings.isEmpty()) {
                log.warn("Nie znaleziono żadnych głosowań w posiedzeniach.");
                return;
            }

            Collections.reverse(allVotings);
            List<FlatVotingReference> last100Votings = allVotings.stream()
                    .limit(100)
                    .toList();

            for (FlatVotingReference ref : last100Votings) {
                syncSingleVoting(ref.proceedingNo(), ref.votingNo());
            }

            log.info("Synchronizacja 100 najnowszych głosowań zakończona.");
        } catch (Exception e) {
            log.error("Błąd podczas pobierania listy nagłówków głosowań: {}", e.getMessage(), e);
        }
    }

    private void syncSingleVoting(Integer proceedingNo, Integer votingNo) {
        if (proceedingNo == null || votingNo == null) return;

        try {
            VotingResponse response = restClient.get()
                    .uri(apiTerm + "/votings/{proceedingNo}/{votingNo}", proceedingNo, votingNo)
                    .retrieve()
                    .body(VotingResponse.class);

            if (response == null || response.votes() == null) {
                return;
            }

            List<VoteSyncItem> items = response.votes().stream()
                    .map(dto -> new VoteSyncItem(dto.MPid(), dto.vote(), dto.isPresent()))
                    .toList();

            votingFacade.saveVoting(new VotingSyncRequest(
                    response.term(),
                    response.proceedingNo(),
                    response.votingNo(),
                    response.title(),
                    items
            ));

            log.info("Zapisano: posiedzenie {}, głosowanie {}", proceedingNo, votingNo);

        } catch (Exception e) {
            log.error("Nie udało się pobrać szczegółów głosowania {}/{}: {}", proceedingNo, votingNo, e.getMessage());
        }
    }

    private record FlatVotingReference(Integer proceedingNo, Integer votingNo) {}
}