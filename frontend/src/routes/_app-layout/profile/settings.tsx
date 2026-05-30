import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import useCurrentUser from '@/hooks/useCurrentUser'
import useUserSettings from '@/hooks/useUserSettings'

export const Route = createFileRoute('/_app-layout/profile/settings')({
  component: RouteComponent,
})

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
      <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">{title}</h3>
      <div className="text-sm text-gray-600 dark:text-gray-300 space-y-3">{children}</div>
    </section>
  )
}

function RouteComponent() {
  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser()
  const mutation = useUserSettings()

  const [displayName, setDisplayName] = useState('')
  const [emailNotifications, setEmailNotifications] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.display_name ?? currentUser.username ?? '')
      // some APIs may expose email notification pref under different key; fallback false
      setEmailNotifications(!!(currentUser.email_notifications ?? false))
    }
  }, [currentUser])

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Ustawienia</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Tu skonfigurujesz swój profil i preferencje.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <SectionCard title="Profil">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <div className="w-24 h-24 bg-gray-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400">Av</div>
                <div className="flex-1 space-y-2">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">Nazwa wyświetlana</label>
                  <input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full sm:w-1/2 px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-maroon-800 dark:focus:border-maroon-600"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">To, co widzą inni użytkownicy.</p>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Powiadomienia">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">E-mail</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Otrzymuj powiadomienia o aktywnościach.</p>
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="form-checkbox h-5 w-5 text-maroon-800 rounded"
                    />
                  </label>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Prywatność (fasada)">
              <p className="text-gray-600 dark:text-gray-300">Opcje prywatności będą tutaj dostępne. To tylko widok — funkcje pojawią się później.</p>
              <div className="flex gap-3 mt-3">
                <button className="px-3 py-2 rounded-md border border-gray-200 dark:border-slate-700 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800">Zarządzaj widocznością</button>
                <button
                  onClick={async () => {
                    setSaved(false)
                    const userId = currentUser?.id
                    if (!userId) return
                    await mutation.mutateAsync({ userId, body: { display_name: displayName, email_notifications: emailNotifications } })
                    setSaved(true)
                    setTimeout(() => setSaved(false), 2500)
                  }}
                  disabled={mutation.status === 'pending' || isUserLoading}
                  className="px-3 py-2 rounded-md bg-maroon-800 text-white text-sm disabled:opacity-60"
                >
                  {mutation.status === 'pending' ? 'Zapiszę...' : saved ? 'Zapisano' : 'Zapisz zmiany'}
                </button>
              </div>
            </SectionCard>
          </div>

          <aside className="space-y-4">
            <SectionCard title="Akcje konta">
              <div className="flex flex-col gap-2">
                <button className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-slate-700 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800">Zmień hasło</button>
                <button className="w-full px-3 py-2 rounded-md bg-red-600 text-white text-sm">Dezaktywuj konto (fasada)</button>
              </div>
            </SectionCard>
          </aside>
        </div>
      </div>
    </div>
  )
}
