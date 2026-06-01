package com.parliament.internal;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;

@Component
@Slf4j
class ModerationClient {

    private final RestClient restClient;

    ModerationClient(RestClient.Builder builder,
                     @Value("${openai.api-key:}") String apiKey) {
        this.restClient = builder
                .baseUrl("https://api.openai.com")
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .build();
    }

    boolean isSafe(String text) {
        try {
            ModerationResponse response = restClient.post()
                    .uri("/v1/moderations")
                    .body(new ModerationRequest(text))
                    .retrieve()
                    .body(ModerationResponse.class);

            if (response == null || response.results() == null || response.results().isEmpty()) {
                return true;
            }
            return !response.results().get(0).flagged();
        } catch (Exception e) {
            log.warn("OpenAI moderation check failed, auto-approving comment: {}", e.getMessage());
            return true;
        }
    }

    record ModerationRequest(String input) {}

    record ModerationResponse(List<Result> results) {
        record Result(boolean flagged) {}
    }
}
