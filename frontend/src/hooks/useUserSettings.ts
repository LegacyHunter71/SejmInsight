
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { patchUser } from '@/api/users'

type PatchVars = { userId: string; body: Record<string, unknown> }

export function useUserSettings() {
    const qc = useQueryClient()

    const mutationFn = (vars: PatchVars): Promise<any> => patchUser(vars.userId, vars.body)

    const mutation = useMutation<any, Error, PatchVars>({
        mutationFn,
        onSuccess: (_data: any, variables: PatchVars) => {
            // invalidate or refetch current user/profile
            qc.invalidateQueries({ queryKey: ['user', variables.userId] })
            qc.invalidateQueries({ queryKey: ['currentUser'] })
        },
    })

    return mutation
}

export default useUserSettings
