package com.parliament.api;

import java.util.List;

public record VotingSyncRequest(
        Integer term,
        Integer proceedingNo,
        Integer votingNo,
        String title,
        List<VoteSyncItem> votes
) {}
