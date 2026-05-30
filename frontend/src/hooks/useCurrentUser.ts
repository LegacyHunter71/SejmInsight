import { useQuery } from '@tanstack/react-query'
import { api } from '@/api/client'

export function fetchCurrentUser() {
    return api.get('/iam/me')
}

export function useCurrentUser() {
    return useQuery({ queryKey: ['currentUser'], queryFn: fetchCurrentUser })
}

export default useCurrentUser
