package com.parliament.internal;

import com.parliament.api.VoteSyncItem;
import com.parliament.api.VotingFacade;
import com.parliament.api.VotingSyncRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
class VotingSyncService {

    private final RestClient restClient;
    private final VotingFacade votingFacade;

    @Value("${parliament.term:10}")
    private String term;

    public void syncAllVotingsFromCurrentTerm() {
        try {
            List<VotingHeaderInDto> headers = restClient.get()
                    .uri("/votings")
                    .retrieve()
                    .body(new ParameterizedTypeReference<List<VotingHeaderInDto>>() {});

            if (headers != null) {
                headers.forEach(header -> syncSingleVoting(header.proceedingNo(), header.votingNo()));
            }
        } catch (Exception e) {
            log.error("Failed to fetch voting list: {}", e.getMessage());
        }
    }

    public void syncSingleVoting(int proceedingNo, int votingNo) {
        try {
            VotingResponse response = restClient.get()
                    .uri("/votings/{proceedingNo}/{votingNo}", proceedingNo, votingNo)
                    .retrieve()
                    .body(VotingResponse.class);

            if (response != null && response.votes() != null) {
                VotingSyncRequest request = mapToRequest(response);
                votingFacade.saveVoting(request);
            }
        } catch (Exception e) {
            log.error("Failed to sync voting {}/{}: {}", proceedingNo, votingNo, e.getMessage());
        }
    }

    private VotingSyncRequest mapToRequest(VotingResponse response) {
        List<VoteSyncItem> items = response.votes().stream()
                .map(dto -> new VoteSyncItem(dto.MPid(), dto.vote(), dto.isPresent()))
                .toList();

        return new VotingSyncRequest(
                response.term(),
                response.proceedingNo(),
                response.votingNo(),
                response.title(),
                items
        );
    }
}


