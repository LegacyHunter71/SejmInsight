package com.parliament.utils;

import com.parliament.deputy.api.dto.DeputySyncRequest;
import com.parliament.deputy.api.facade.DeputyFacade;
import com.parliament.dto.DeputyInDto;
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
public class DeputySyncService {
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
                // Mapujemy na DTO z API modułu Deputy
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
