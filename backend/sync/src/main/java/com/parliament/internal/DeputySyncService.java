package com.parliament.internal;

import com.parliament.deputy.api.dto.DeputySyncRequest;
import com.parliament.deputy.api.facade.DeputyFacade;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
class DeputySyncService {
    private final RestClient restClient;
    private final DeputyFacade deputyFacade;

    @Value("${parliament.term}")
    private String apiTerm;

    public void syncDeputies() {
        log.info("Pobieranie danych z API Sejmu...");
        try {
            List<DeputyInDto> externalDeputies = restClient.get()
                    .uri(apiTerm)
                    .retrieve()
                    .body(new ParameterizedTypeReference<List<DeputyInDto>>() {});

            if (externalDeputies != null) {
                List<DeputySyncRequest> requests = externalDeputies.stream()
                        .map(dto -> new DeputySyncRequest(
                                dto.id(), dto.firstLastName(), dto.club(), dto.districtName(), dto.active()
                        )).toList();

                deputyFacade.syncDeputies(requests);
                log.info("Przekazano {} posłów do zapisu.", requests.size());
            }
        } catch (Exception e) {
            log.error("Błąd synchronizacji: {}", e.getMessage());
        }
    }
}
