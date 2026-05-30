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
            // KROK 1: Pobieramy listę wszystkich posiedzeń
            List<ProceedingDto> proceedings = restClient.get()
                    .uri(apiTerm + "/votings")
                    .retrieve()
                    .body(new ParameterizedTypeReference<List<ProceedingDto>>() {});

            if (proceedings == null || proceedings.isEmpty()) {
                log.warn("API Sejmu zwróciło pustą listę posiedzeń.");
                return;
            }

            // Odwracamy, żeby zacząć od najnowszego posiedzenia
            Collections.reverse(proceedings);

            List<FlatVotingReference> votingsToSync = new ArrayList<>();

            // KROK 2: Przebijamy się przez posiedzenia i zbieramy nagłówki głosowań
            for (ProceedingDto p : proceedings) {
                if (p.sitting() == null) continue;

                // Pobieramy listę głosowań z tego konkretnego posiedzenia
                List<VotingHeaderDto> headers = restClient.get()
                        .uri(apiTerm + "/votings/{sitting}", p.sitting())
                        .retrieve()
                        .body(new ParameterizedTypeReference<List<VotingHeaderDto>>() {});

                if (headers != null && !headers.isEmpty()) {
                    // Odwracamy głosowania, by najnowsze z danego dnia były na początku
                    Collections.reverse(headers);
                    for (VotingHeaderDto h : headers) {
                        if (h.votingNumber() != null) {
                            votingsToSync.add(new FlatVotingReference(p.sitting(), h.votingNumber()));
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

            // KROK 3: Pobieramy szczegóły i wysyłamy do Fasady (Zapis do Bazy)
            for (FlatVotingReference ref : votingsToSync) {
                syncSingleVotingDetails(ref.sitting(), ref.votingNumber());
            }

            log.info("Synchronizacja najnowszych głosowań zakończona pełnym sukcesem!");

        } catch (Exception e) {
            log.error("Błąd krytyczny podczas synchronizacji: {}", e.getMessage(), e);
        }
    }

    private void syncSingleVotingDetails(Integer sitting, Integer votingNumber) {
        try {
            VotingResponse response = restClient.get()
                    .uri(apiTerm + "/votings/{sitting}/{votingNumber}", sitting, votingNumber)
                    .retrieve()
                    .body(VotingResponse.class);

            if (response == null || response.votes() == null) return;

            List<VoteSyncItem> items = response.votes().stream()
                    .map(dto -> new VoteSyncItem(dto.MPid(), dto.vote(), dto.isPresent()))
                    .toList();

            // Zabezpieczamy się, gdyby API znów czegoś nie przysłało
            Integer finalTerm = response.term() != null ? response.term() : 10;
            Integer finalSitting = response.sitting() != null ? response.sitting() : sitting;
            Integer finalVotingNo = response.votingNumber() != null ? response.votingNumber() : votingNumber;

            votingFacade.saveVoting(new VotingSyncRequest(
                    finalTerm,
                    finalSitting,
                    finalVotingNo,
                    response.title(),
                    items
            ));

            log.info("Zapisano: posiedzenie {}, głosowanie {}", finalSitting, finalVotingNo);

        } catch (Exception e) {
            log.error("Nie udało się pobrać szczegółów dla {}/{}: {}", sitting, votingNumber, e.getMessage());
        }
    }

    record FlatVotingReference(Integer sitting, Integer votingNumber) {}
}