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
        log.info("=========================================================");
        log.info("Rozpoczynam zaktualizowaną synchronizację 100 najnowszych głosowań...");
        log.info("Konfiguracja apiTerm: {}", apiTerm);
        log.info("=========================================================");

        try {
            // KROK 1: Pobieramy listę wszystkich posiedzeń
            log.info("[KROK 1] Łączę się z API Sejmu w celu pobrania listy posiedzeń...");
            log.debug("Adres docelowy: /{}/votings", apiTerm);

            List<ProceedingDto> proceedings = restClient.get()
                    .uri("/{term}/votings", apiTerm)
                    .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                    .retrieve()
                    .body(new ParameterizedTypeReference<List<ProceedingDto>>() {
                    });

            if (proceedings == null || proceedings.isEmpty()) {
                log.warn("[KROK 1] API Sejmu zwróciło pustą listę posiedzeń. Przerywam operację.");
                return;
            }
            log.info("[KROK 1] Sukces! Pomyślnie pobrano {} posiedzeń z Sejmu.", proceedings.size());

            // Odwracamy, żeby zacząć od najnowszego posiedzenia
            Collections.reverse(proceedings);

            List<FlatVotingReference> votingsToSync = new ArrayList<>();

            // KROK 2: Przebijamy się przez posiedzenia i zbieramy nagłówki głosowań
            log.info("[KROK 2] Rozpoczynam przeszukiwanie posiedzeń w poszukiwaniu głosowań...");

            for (ProceedingDto p : proceedings) {
                if (p.sitting() == null) {
                    log.debug("Pominięto posiedzenie bez numeru ID.");
                    continue;
                }

                log.info("-> Pytam API o listę głosowań dla posiedzenia nr {}", p.sitting());

                List<VotingHeaderInDto> headers = restClient.get()
                        .uri("/{term}/votings/{sitting}", apiTerm, p.sitting())
                        .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                        .retrieve()
                        .body(new ParameterizedTypeReference<List<VotingHeaderInDto>>() {
                        });

                if (headers != null && !headers.isEmpty()) {
                    log.info("<- Znaleziono {} głosowań w posiedzeniu nr {}", headers.size(), p.sitting());
                    Collections.reverse(headers);

                    for (VotingHeaderInDto h : headers) {
                        if (h.votingNumber() != null) {
                            votingsToSync.add(new FlatVotingReference(p.sitting(), h.votingNumber()));
                        }
                        if (votingsToSync.size() >= 100) break;
                    }
                } else {
                    log.warn("<- Posiedzenie nr {} nie zawiera żadnych głosowań.", p.sitting());
                }

                log.info("Aktualny stan koszyka do pobrania: {} / 100", votingsToSync.size());
                if (votingsToSync.size() >= 100) break;
            }

            if (votingsToSync.isEmpty()) {
                log.warn("[KROK 2] UWAGA! Nie udało się zebrać żadnych nagłówków głosowań z posiedzeń.");
                return;
            }

            log.info("[KROK 2] Sukces! Skompletowano {} głosowań. Przechodzę do pobierania szczegółów.", votingsToSync.size());

            // KROK 3: Pobieramy szczegóły i wysyłamy do Fasady
            log.info("[KROK 3] Rozpoczynam pobieranie szczegółów i zapis do bazy danych...");
            int counter = 1;

            for (FlatVotingReference ref : votingsToSync) {
                log.info("Przetwarzam {}/{} -> Posiedzenie: {}, Głosowanie: {}",
                        counter++, votingsToSync.size(), ref.sitting(), ref.votingNumber());
                syncSingleVotingDetails(ref.sitting(), ref.votingNumber());
            }

            log.info("=========================================================");
            log.info("🎉 Synchronizacja najnowszych głosowań zakończona pełnym sukcesem!");
            log.info("=========================================================");

        } catch (Exception e) {
            log.error("❌ BŁĄD KRYTYCZNY podczas synchronizacji: {}", e.getMessage(), e);
        }
    }

    private void syncSingleVotingDetails(Integer sitting, Integer votingNumber) {
        try {
            SejmVotingResponse response = restClient.get()
                    .uri("/{term}/votings/{sitting}/{votingNumber}", apiTerm, sitting, votingNumber)
                    .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                    .retrieve()
                    .body(SejmVotingResponse.class);

            if (response == null || response.votes() == null) {
                log.warn("Szczegóły dla posiedzenia {}, głosowania {} są puste!", sitting, votingNumber);
                return;
            }

            List<VoteSyncItem> items = response.votes().stream()
                    .map(dto -> new VoteSyncItem(dto.MPid(), dto.vote(), dto.isPresent()))
                    .toList();

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

            log.info("✅ Pomyślnie zapisano w DB: posiedzenie {}, głosowanie {}", finalSitting, finalVotingNo);

        } catch (Exception e) {
            log.error("❌ BŁĄD: Nie udało się pobrać/zapisać szczegółów dla posiedzenia {} / głosowania {}. Powód: {}",
                    sitting, votingNumber, e.getMessage());
        }
    }
    private record FlatVotingReference(Integer sitting, Integer votingNumber) {}
}