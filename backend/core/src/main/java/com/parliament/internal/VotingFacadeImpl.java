package com.parliament.internal;

import com.parliament.api.VotingDto;
import com.parliament.api.VotingFacade;
import com.parliament.api.VotingSyncRequest;
import com.parliament.enums.VoteKind;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
class VotingFacadeImpl implements VotingFacade {

    private final VotingRepository votingRepository;
    private final VoteResultRepository voteResultRepository;

    @Override
    @Transactional
    public void saveVoting(VotingSyncRequest request) {
        Voting voting = votingRepository
                .findByVoteTermAndProceedingNoAndVotingNo(request.term(), request.proceedingNo(), request.votingNo())
                .orElseGet(() -> Voting.builder()
                        .voteTerm(request.term())
                        .proceedingNo(request.proceedingNo())
                        .votingNo(request.votingNo())
                        .build());
        voting.setTitle(request.title());
        Voting saved = votingRepository.save(voting);

        voteResultRepository.deleteByVotingId(saved.getId());

        List<VoteResult> results = request.votes().stream()
                .map(item -> new VoteResult(
                        new VoteResultId(saved.getId(), item.mpId()),
                        parseVote(item.vote()),
                        item.present()))
                .toList();
        voteResultRepository.saveAll(results);

        log.debug("Saved voting {}/{}/{} with {} votes",
                request.term(), request.proceedingNo(), request.votingNo(), results.size());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VotingDto> getDeputyVotings(Integer deputyId, VoteKind vote, String title, Pageable pageable) {
        Specification<VoteResult> spec = Specification
                .where(VoteResultSpecification.forDeputy(deputyId))
                .and(VoteResultSpecification.hasVote(vote))
                .and(VoteResultSpecification.titleContains(title));

        return voteResultRepository.findAll(spec, pageable).map(this::toDto);
    }

    private VotingDto toDto(VoteResult vr) {
        Voting v = vr.getVoting();
        return new VotingDto(v.getId().toString(), v.getVoteTerm(), v.getProceedingNo(),
                v.getVotingNo(), v.getTitle(), vr.getVote(), vr.isPresent());
    }

    private VoteKind parseVote(String raw) {
        if (raw == null) return VoteKind.NOT_VOTED;
        try {
            return VoteKind.valueOf(raw.toUpperCase());
        } catch (IllegalArgumentException e) {
            return VoteKind.NOT_VOTED;
        }
    }
}
