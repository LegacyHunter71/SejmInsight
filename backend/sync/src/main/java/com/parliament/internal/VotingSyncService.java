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
            List<VotingHeaderInDto> headers = restClient.get()
                    .uri(apiTerm + "/votings")
                    .retrieve()
                    .body(new ParameterizedTypeReference<List<VotingHeaderInDto>>() {});

            if (headers == null || headers.isEmpty()) {
                log.warn("API Sejmu zwróciło pustą listę nagłówków.");
                return;
            }

            Collections.reverse(headers);

            List<VotingHeaderInDto> last100Headers = headers.stream()
                    .limit(100)
                    .toList();

            last100Headers.forEach(h -> syncSingleVoting(h.proceedingNo(), h.votingNo()));

            log.info("Synchronizacja 100 najnowszych głosowań zakończona.");
        } catch (Exception e) {
            log.error("Błąd podczas pobierania listy nagłówków głosowań: {}", e.getMessage());
        }
    }

    private void syncSingleVoting(int proceedingNo, int votingNo) {
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
        } catch (Exception e) {
            log.error("Nie udało się pobrać szczegółów głosowania {}/{}: {}", proceedingNo, votingNo, e.getMessage());
        }
    }
}
