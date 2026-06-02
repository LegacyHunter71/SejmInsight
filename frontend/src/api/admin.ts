import api from "./client";

/** Triggers backend sync of deputies data. */
export async function syncDeputies(): Promise<void> {
  await api.post<void>("/admin/sync/deputies");
}

/** Triggers backend sync of votings data. */
export async function syncVotings(): Promise<void> {
  await api.post<void>("/admin/sync/votings");
}

/** Fetch comments pending moderation */
export async function getPendingComments() {
  return api.get<
    import("@/generated/api-types").components["schemas"]["AdminCommentDto"][]
  >("/admin/comments/pending");
}

/** Approve a pending comment */
export async function approveComment(commentId: string) {
  return api.post<void>(
    `/admin/comments/${encodeURIComponent(commentId)}/approve`,
  );
}

/** Reject a pending comment */
export async function rejectComment(commentId: string) {
  return api.post<void>(
    `/admin/comments/${encodeURIComponent(commentId)}/reject`,
  );
}

export default {
  syncDeputies,
  syncVotings,
  getPendingComments,
  approveComment,
  rejectComment,
};
