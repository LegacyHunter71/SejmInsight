import { api } from "@/api/client";
import type { components } from "@/generated/api-types";

type PatchUserDto = {
  display_name?: string;
  email_notifications?: boolean;
};

export async function patchUser(userId: string, body: PatchUserDto) {
  return api.patch(`/iam/users/${encodeURIComponent(userId)}`, body);
}

export async function getUser(userId: string) {
  return api.get(`/iam/users/${encodeURIComponent(userId)}`);
}

export type RegisterUserDto = components["schemas"]["UserCreateRequest"];

/** Register a new user via IAM (no Keycloak redirect). Returns void on success (201 Created). */
export async function registerUser(body: RegisterUserDto) {
  return api.post<void>("/iam/register", body);
}

export default { patchUser, getUser };
