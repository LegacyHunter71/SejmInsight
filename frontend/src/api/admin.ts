import api from "./client";

/** Triggers backend sync of deputies data. */
export async function syncDeputies(): Promise<void> {
  await api.post<void>("/admin/sync/deputies");
}

/** Triggers backend sync of votings data. */
export async function syncVotings(): Promise<void> {
  await api.post<void>("/admin/sync/votings");
}

export default {
  syncDeputies,
  syncVotings,
};
