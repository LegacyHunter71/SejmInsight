import { api } from '@/api/client'

type PatchUserDto = {
    display_name?: string
    email_notifications?: boolean
}

export async function patchUser(userId: string, body: PatchUserDto) {
    return api.patch(`/iam/users/${encodeURIComponent(userId)}`, body)
}

export async function getUser(userId: string) {
    return api.get(`/iam/users/${encodeURIComponent(userId)}`)
}

export default { patchUser, getUser }
