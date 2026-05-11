'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginValues } from '../schemas/auth-schema'
import { login } from '../actions/auth-actions'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import GoogleIcon from '@/components/shared/icons/google'

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

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

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          ¡Bienvenido de nuevo!
        </h1>
        <p className="text-base text-muted-foreground font-medium">
          Simplifica tus intercambios y mejora tu colección con PaniniTrade.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5 group">
          <label className="text-sm font-bold text-muted-foreground" htmlFor="email">
            Correo electrónico
          </label>
          <input
            {...register('email')}
            id="email"
            placeholder="nombre@ejemplo.com"
            className={`w-full h-12 px-4 rounded-xl bg-muted border ${errors.email ? 'border-destructive focus:border-destructive' : 'border-transparent focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/20'} outline-none transition-[border-color,background-color,box-shadow] duration-200 font-semibold text-foreground placeholder:font-medium placeholder:text-muted-foreground/70`}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-[10px] font-bold text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2 group">
          <label className="text-sm font-bold text-muted-foreground flex justify-between items-center" htmlFor="password">
            Contraseña
            <Link href="/forgot-password" className="text-xs text-primary hover:underline font-bold">
              ¿Olvidaste tu contraseña?
            </Link>
          </label>
          <input
            {...register('password')}
            id="password"
            type="password"
            className={`w-full h-12 px-4 rounded-xl bg-muted border ${errors.password ? 'border-destructive focus:border-destructive' : 'border-transparent focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/20'} outline-none transition-[border-color,background-color,box-shadow] duration-200 font-semibold text-foreground placeholder:font-medium placeholder:text-muted-foreground/70`}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-[10px] font-bold text-destructive">{errors.password.message}</p>
          )}
        </div>

        {error && (
          <div className="p-3 text-xs font-bold text-destructive bg-destructive/10 border border-destructive/20 rounded-xl">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full cursor-pointer h-12 rounded-xl font-bold text-base shadow-xl shadow-primary/20 active:scale-[0.97] transition-[transform,box-shadow] duration-200"
          style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Iniciar sesión'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-[11px] font-bold tracking-wider">
          <span className="bg-background px-4 text-muted-foreground">o continúa con</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleLogin}
        className="w-full cursor-pointer h-12 rounded-xl font-bold gap-3 active:scale-[0.97] transition-[transform,background-color] duration-200 border-2"
        style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
        disabled={isLoading}
      >
        <GoogleIcon />
        Continuar con Google
      </Button>

      <div className="text-center text-sm font-medium pt-1">
        <span className="text-muted-foreground">¿No eres miembro?</span>{' '}
        <Link href="/signup" className="text-primary hover:underline font-bold">
          Regístrate ahora
        </Link>
      </div>
    </div>
  )
}
