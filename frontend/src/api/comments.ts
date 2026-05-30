import api from "./client";
import type { components } from "../generated/api-types";

type CommentDto = components["schemas"]["CommentDto"];
type CommentCreateRequest = components["schemas"]["CommentCreateRequest"];
type LikeResult = components["schemas"]["LikeResult"];

const basePath = (deputyId: number, term: number, proceedingNo: number, votingNo: number) =>
    `/deputies/${deputyId}/votings/${term}/${proceedingNo}/${votingNo}/comments`;

export async function getComments(
    deputyId: number,
    term: number,
    proceedingNo: number,
    votingNo: number,
): Promise<CommentDto[]> {
    return api.get<CommentDto[]>(basePath(deputyId, term, proceedingNo, votingNo));
}

export async function addComment(
    deputyId: number,
    term: number,
    proceedingNo: number,
    votingNo: number,
    payload: CommentCreateRequest,
): Promise<void> {
    await api.post<void>(basePath(deputyId, term, proceedingNo, votingNo), payload);
}

export async function addReply(commentId: string, payload: CommentCreateRequest): Promise<void> {
    await api.post<void>(`/comments/${commentId}/replies`, payload);
}

export async function toggleLike(commentId: string): Promise<LikeResult> {
    return api.post<LikeResult>(`/comments/${commentId}/likes`);
}

export async function deleteComment(commentId: string): Promise<void> {
    await api.del<void>(`/comments/${commentId}`);
}

export default {
    getComments,
    addComment,
    addReply,
    toggleLike,
    deleteComment,
};
