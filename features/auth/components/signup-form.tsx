'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema, type SignupValues } from '../schemas/auth-schema'
import { signup } from '../actions/auth-actions'
import { useState } from 'react'
import Link from 'next/link'

export function SignupForm() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
  })

  async function onSubmit(values: SignupValues) {
    setIsLoading(true)
    setError(null)
    const result = await signup(values)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-2xl shadow-xl">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Crea tu cuenta
        </h1>
        <p className="text-muted-foreground">
          Únete a la comunidad de coleccionistas
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="fullName">
            Nombre completo
          </label>
          <input
            {...register('fullName')}
            id="fullName"
            placeholder="Juan Pérez"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={isLoading}
          />
          {errors.fullName && (
            <p className="text-sm font-medium text-destructive">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="email">
            Correo electrónico
          </label>
          <input
            {...register('email')}
            id="email"
            placeholder="nombre@ejemplo.com"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm font-medium text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="password">
            Contraseña
          </label>
          <input
            {...register('password')}
            id="password"
            type="password"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
          className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Creando cuenta...' : 'Registrarse'}
        </button>
      </form>

      <div className="text-center text-sm">
        ¿Ya tienes una cuenta?{' '}
        <Link href="/login" className="underline hover:text-foreground">
          Inicia sesión
        </Link>
      </div>
    </div>
  )
}
