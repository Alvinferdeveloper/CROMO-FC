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
    <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-2xl shadow-xl">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Bienvenido de nuevo
        </h1>
        <p className="text-muted-foreground">
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
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm font-medium text-destructive">{errors.email.message}</p>
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
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-sm font-medium text-destructive">{errors.password.message}</p>
          )}
        </div>

        {error && (
          <div className="p-3 text-sm font-medium text-destructive-foreground bg-destructive rounded-md">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
        </button>
      </form>

      <div className="text-center text-sm">
        ¿No tienes una cuenta?{' '}
        <Link href="/signup" className="underline hover:text-foreground">
          Regístrate
        </Link>
      </div>
    </div>
  )
}
