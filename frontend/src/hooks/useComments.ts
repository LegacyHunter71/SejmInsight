import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as commentsService from "../api/comments";
import type { components } from "../generated/api-types";

type CommentDto = components["schemas"]["CommentDto"];
type CommentCreateRequest = components["schemas"]["CommentCreateRequest"];

export function useComments(deputyId: number, term: number, proceedingNo: number, votingNo: number) {
    const key = ["comments", deputyId, term, proceedingNo, votingNo] as const;
    return useQuery<CommentDto[]>({
        queryKey: key,
        queryFn: () => commentsService.getComments(deputyId, term, proceedingNo, votingNo),
        staleTime: 1000 * 60, // 1 minute
    });
}

export function useAddComment(deputyId: number, term: number, proceedingNo: number, votingNo: number) {
    const queryClient = useQueryClient();
    return useMutation<void, any, CommentCreateRequest>({
        mutationFn: (payload) => commentsService.addComment(deputyId, term, proceedingNo, votingNo, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", deputyId, term, proceedingNo, votingNo] as const });
        },
    });
}

export function useAddReply(commentId: string) {
    const queryClient = useQueryClient();
    return useMutation<void, any, CommentCreateRequest>({
        mutationFn: (payload) => commentsService.addReply(commentId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments"] as const });
        },
    });
}

export function useToggleLike() {
    const queryClient = useQueryClient();
    return useMutation<{ likeCount?: number; liked?: boolean }, any, string>({
        mutationFn: (commentId) => commentsService.toggleLike(commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments"] as const });
        },
    });
}

export function useDeleteComment() {
    const queryClient = useQueryClient();
    return useMutation<void, any, string>({
        mutationFn: (commentId) => commentsService.deleteComment(commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments"] as const });
        },
    });
}
