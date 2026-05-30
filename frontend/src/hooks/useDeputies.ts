import { useQuery } from "@tanstack/react-query";
import * as deputiesService from "../api/deputies";
import type { PageableParams } from "../utils/pagination";

export function useDeputies(params?: PageableParams & { name?: string; club?: string; districtName?: string; active?: boolean }) {
    const key = ["deputies", params ?? {}] as const;
    return useQuery({
        queryKey: key,
        queryFn: () => deputiesService.getDeputies(params),
        staleTime: 1000 * 60 * 2,
    });
}

export function useDeputyVotings(deputyId: number, params?: PageableParams & { vote?: string; title?: string }) {
    const key = ["deputyVotings", deputyId, params ?? {}] as const;
    return useQuery({
        queryKey: key,
        queryFn: () => deputiesService.getDeputyVotings(deputyId, params),
        staleTime: 1000 * 60,
    });
}
