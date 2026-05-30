package com.parliament.internal;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.parliament.api.VoteSyncItem;
import com.parliament.api.VotingFacade;
import com.parliament.api.VotingSyncRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class VotingSyncService {

    private final RestClient restClient;
    private final VotingFacade votingFacade;

    @Value("${parliament.term}")
    private String apiTerm;

    public void syncLast100Votings() {
        log.info("Rozpoczynam zaktualizowaną synchronizację 100 najnowszych głosowań...");
        try {
            List<ProceedingDto> proceedings = restClient.get()
                    .uri(apiTerm + "/votings")
                    .retrieve()
                    .body(new ParameterizedTypeReference<List<ProceedingDto>>() {});

            if (proceedings == null || proceedings.isEmpty()) {
                log.warn("API Sejmu zwróciło pustą listę posiedzeń.");
                return;
            }

            Collections.reverse(proceedings);

            List<FlatVotingReference> votingsToSync = new ArrayList<>();

            for (ProceedingDto p : proceedings) {
                if (p.proceedingNo() == null) continue;

                List<VotingHeaderDto> headers = restClient.get()
                        .uri(apiTerm + "/votings/{proceedingNo}", p.proceedingNo())
                        .retrieve()
                        .body(new ParameterizedTypeReference<List<VotingHeaderDto>>() {});

                if (headers != null && !headers.isEmpty()) {
                    Collections.reverse(headers);
                    for (VotingHeaderDto h : headers) {
                        if (h.votingNo() != null) {
                            votingsToSync.add(new FlatVotingReference(p.proceedingNo(), h.votingNo()));
                        }

                        if (votingsToSync.size() >= 100) break;
                    }
                }

                if (votingsToSync.size() >= 100) break;
            }

            if (votingsToSync.isEmpty()) {
                log.warn("Nie udało się pobrać żadnych głosowań z posiedzeń.");
                return;
            }

            log.info("Uzbierano {} głosowań. Rozpoczynam pobieranie szczegółów i zapis do bazy...", votingsToSync.size());

            for (FlatVotingReference ref : votingsToSync) {
                syncSingleVotingDetails(ref.proceedingNo(), ref.votingNo());
            }

            log.info("Synchronizacja najnowszych głosowań zakończona pełnym sukcesem!");

        } catch (Exception e) {
            log.error("Błąd krytyczny podczas synchronizacji: {}", e.getMessage(), e);
        }
    }

    private void syncSingleVotingDetails(Integer proceedingNo, Integer votingNo) {
        try {
            VotingResponse response = restClient.get()
                    .uri(apiTerm + "/votings/{proceedingNo}/{votingNo}", proceedingNo, votingNo)
                    .retrieve()
                    .body(VotingResponse.class);

            if (response == null || response.votes() == null) return;

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

            log.debug("Zapisano: posiedzenie {}, głosowanie {}", proceedingNo, votingNo);

        } catch (Exception e) {
            log.error("Nie udało się pobrać szczegółów dla {}/{}: {}", proceedingNo, votingNo, e.getMessage());
        }
    }

    // --- WEWNĘTRZNE REKORDY DTO (Dopasowane do API Sejmu) ---

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record ProceedingDto(@JsonProperty("proceedingNo") Integer proceedingNo) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record VotingHeaderDto(@JsonProperty("votingNo") Integer votingNo) {}

    private record FlatVotingReference(Integer proceedingNo, Integer votingNo) {}
}