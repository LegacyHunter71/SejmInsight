export default function InitLoading({ message }: { message?: string }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-slate-900 z-50">
            <div className="w-full max-w-md mx-auto p-6">
                <div className="flex flex-col items-center gap-6">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-slate-700 border-t-4 border-t-maroon-800 dark:border-t-maroon-400 shadow-sm" aria-hidden />
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Inicjalizacja sesji</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{message ?? 'Sprawdzam Twoje logowanie i konfiguruję środowisko...'}</p>
                    </div>

                    {/* spinner-only: progress bar removed */}
                </div>
            </div>
        </div>
    )
}
