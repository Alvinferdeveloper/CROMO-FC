'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginValues } from '../schemas/auth-schema'
import { login } from '../actions/auth-actions'
import { useState } from 'react'
import Link from 'next/link'

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(values: LoginValues) {
    setIsLoading(true)
    setError(null)
    const result = await login(values)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl dark:bg-zinc-900">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Bienvenido de nuevo
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Ingresa tus credenciales para acceder a tu cuenta
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
            Correo electrónico
          </label>
          <input
            {...register('email')}
            id="email"
            placeholder="nombre@ejemplo.com"
            className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm font-medium text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
            Contraseña
          </label>
          <input
            {...register('password')}
            id="password"
            type="password"
            className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-sm font-medium text-red-500">{errors.password.message}</p>
          )}
        </div>

        {error && (
          <div className="p-3 text-sm font-medium text-white bg-red-500 rounded-md">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 h-10 px-4 py-2 w-full dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90"
          disabled={isLoading}
        >
          {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
        </button>
      </form>

      <div className="text-center text-sm">
        ¿No tienes una cuenta?{' '}
        <Link href="/signup" className="underline hover:text-zinc-900 dark:hover:text-zinc-50">
          Regístrate
        </Link>
      </div>
    </div>
  )
}
