import { createClient } from '@/lib/supabase-server'
import { logout } from '@/features/auth/actions/auth-actions'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 dark:bg-black font-sans p-4">
      <main className="w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-8 md:p-12 text-center md:text-left space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Panini Trade 2026
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-lg">
              La plataforma definitiva para coleccionistas del Mundial. Cambia, encuentra y completa tu álbum.
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            {user ? (
              <div className="space-y-4">
                <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Conectado como:</p>
                  <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{user.email}</p>
                </div>
                <form action={logout}>
                  <button className="w-full h-12 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 transition-colors">
                    Cerrar Sesión
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/login"
                  className="flex h-12 px-8 items-center justify-center rounded-full bg-zinc-900 text-zinc-50 font-medium hover:bg-zinc-800 transition-colors dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/signup"
                  className="flex h-12 px-8 items-center justify-center rounded-full border border-zinc-200 text-zinc-900 font-medium hover:bg-zinc-50 transition-colors dark:border-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800"
                >
                  Crear Cuenta
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-zinc-100 dark:border-zinc-800">
          <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl space-y-2 text-center">
            <span className="text-3xl">🌎</span>
            <h3 className="font-bold">Intercambios Locales</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Encuentra coleccionistas cerca de ti.</p>
          </div>
          <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl space-y-2 text-center">
            <span className="text-3xl">🃏</span>
            <h3 className="font-bold">Gestión de Álbum</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Lleva el control de tus repetidas.</p>
          </div>
          <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl space-y-2 text-center">
            <span className="text-3xl">💬</span>
            <h3 className="font-bold">Chat Seguro</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Coordina tus cambios fácilmente.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
