import { useQuery } from "@tanstack/react-query";
import * as deputiesService from "@/api/deputies";

export function useDeputy(deputyId: number) {
    return useQuery({ queryKey: ["deputy", deputyId], queryFn: () => deputiesService.getDeputyById(deputyId), staleTime: 1000 * 60 * 5 });
}
