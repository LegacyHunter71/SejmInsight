package com.parliament.internal;

import com.parliament.api.VotingFacade;
import com.parliament.api.VotingSyncRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
class VotingFacadeImpl implements VotingFacade {

    @Override
    public void saveVoting(VotingSyncRequest request) {
        System.out.println("save voting");
    }
}
