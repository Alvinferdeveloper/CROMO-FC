'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  User as UserIcon, MessageCircle, MapPin,
  Navigation, CheckCircle2, Loader2,
  Sparkles, Phone
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from '@/lib/utils'
import { profileSchema, type ProfileValues } from '../schemas/profile-schema'
import { updateProfile } from '../actions/profile-actions'
import { completeOnboarding } from '../actions/onboarding-actions'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/types/card'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

interface OnboardingFormProps {
  user: User
  profile: Profile
  onSuccess: () => void
  onSkip?: () => void
}

export function OnboardingForm({ user, profile, onSuccess, onSkip }: OnboardingFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.user_metadata?.full_name || '',
      country: profile?.country || '',
      locationCity: profile?.location_city || '',
      whatsapp: profile?.contact_methods?.whatsapp || '',
      instagram: profile?.contact_methods?.instagram || '',
    },
  })

  const capturedLat = watch('lat')

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setValue('lat', pos.coords.latitude)
        setValue('lng', pos.coords.longitude)
      })
    }
  }

  const onFinalSubmit = async (data: ProfileValues) => {
    setIsLoading(true)
    try {
      await updateProfile(data)
      await completeOnboarding()
      onSuccess()
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const inputClasses = (hasError: boolean) => cn(
    "w-full h-11 pl-11 pr-4 rounded-xl bg-muted border-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-zinc-800 transition-all font-medium text-slate-900 dark:text-white",
    hasError ? 'border-destructive focus:border-destructive' : 'border-transparent focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/20 outline-none transition-[border-color,background-color,box-shadow] duration-200 font-semibold text-foreground placeholder:font-medium placeholder:text-muted-foreground/70'
  )

  return (
    <form onSubmit={handleSubmit(onFinalSubmit)} className="space-y-6 max-w-sm mx-auto">
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em]">
          <Sparkles className="w-3 h-3" /> Perfil de coleccionista
        </div>
        <h2 className="text-2xl font-black tracking-tighter">Crea tu identidad</h2>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          Un perfil completo genera un <span className="text-emerald-600 font-bold">80% más de confianza</span> en los intercambios locales.
        </p>
      </div>

      <div className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1 group">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Nombre</label>
          <div className="relative">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              {...register('fullName')}
              className={inputClasses(!!errors.fullName)}
              placeholder="Tu nombre"
            />
          </div>
        </div>

        {/* Social Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1 group">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">WhatsApp</label>
            <div className={cn(
              "relative flex items-center w-full h-11 px-3 rounded-xl bg-muted border transition-all duration-200",
              errors.whatsapp ? "border-destructive ring-1 ring-destructive" : "border-transparent focus-within:ring-4 focus-within:ring-primary/20 focus-within:bg-background focus-within:border-primary"
            )}>
              <MessageCircle className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />
              <Controller
                name="whatsapp"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    international
                    defaultCountry="MX"
                    placeholder="Teléfono"
                    value={field.value}
                    onChange={field.onChange}
                    className="flex-1 bg-transparent text-foreground font-semibold outline-none"
                    numberInputProps={{
                      className: "w-full bg-transparent outline-none h-10 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-muted-foreground/50",
                    }}
                  />
                )}
              />
            </div>
            {errors.whatsapp && <p className="text-[9px] font-bold text-destructive px-1">{errors.whatsapp.message}</p>}
          </div>
          <div className="space-y-1 group">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Instagram</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-rose-500">@</span>
              <input
                {...register('instagram')}
                className={cn(inputClasses(!!errors.instagram), "pl-9")}
                placeholder="usuario"
              />
            </div>
          </div>
        </div>

        {/* Location Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3 h-3" /> Ubicación
            </span>
            <button
              type="button"
              onClick={handleGetLocation}
              className={cn(
                "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter transition-all flex items-center gap-1",
                capturedLat
                  ? "bg-emerald-500 text-white"
                  : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
              )}
            >
              {capturedLat ? <><CheckCircle2 className="w-3 h-3" /> Listo</> : <><Navigation className="w-3 h-3" /> GPS</>}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              {...register('country')}
              className=" h-11 pl-9 pr-3 rounded-lg bg-muted border border-transparent focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-[border-color,background-color,box-shadow] duration-200 font-medium text-sm placeholder:text-muted-foreground/70"
              placeholder="País"
            />
            <input
              {...register('locationCity')}
              className=" h-11 pl-9 pr-3 rounded-lg bg-muted border border-transparent focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-[border-color,background-color,box-shadow] duration-200 font-medium text-sm placeholder:text-muted-foreground/70"
              placeholder="Ciudad"
            />
          </div>
        </div>
      </div>

      <div className="pt-2 space-y-3">
        <Button
          disabled={isLoading}
          className="w-full h-14 rounded-2xl cursor-pointer font-bold text-lg shadow-xl shadow-primary/20 active:scale-[0.97] disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none transition-[transform,opacity,box-shadow] duration-200"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'FINALIZAR PERFIL'}
        </Button>

        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="w-full py-2 text-[10px] font-black text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 uppercase tracking-[0.2em] transition-colors"
          >
            Configurar más tarde
          </button>
        )}
      </div>
    </form>
  )
}
