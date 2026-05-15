'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema, type ProfileValues } from '../schemas/profile-schema'
import { updateProfile } from '../actions/profile-actions'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { MapPin, Loader2, User, Globe, Navigation, Mail, Phone } from 'lucide-react'
import InstagramIcon from '@/components/shared/icons/Instagram'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

import { Profile } from '@/types/card'

interface ProfileFormProps {
  initialData: Profile & { email?: string }
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCapturingLocation, setIsCapturingLocation] = useState(false)

  const contactMethods = initialData.contact_methods || {}

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: initialData.full_name || '',
      whatsapp: contactMethods.whatsapp || '',
      instagram: contactMethods.instagram || '',
      locationCity: initialData.location_city || '',
      country: initialData.country || '',
      lat: initialData.location_lat || undefined,
      lng: initialData.location_lng || undefined,
    },
  })

  // Register hidden fields
  useEffect(() => {
    register('lat')
    register('lng')
  }, [register])

  const capturedLat = watch('lat')

  const handleGetLocation = () => {
    setIsCapturingLocation(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('lat', position.coords.latitude, { shouldDirty: true })
          setValue('lng', position.coords.longitude, { shouldDirty: true })
          setIsCapturingLocation(false)
        },
        (error) => {
          console.error("GPS Error:", error)
          setIsCapturingLocation(false)
        }
      )
    }
  }

  async function onSubmit(values: ProfileValues) {
    setIsLoading(true)
    setMessage(null)
    const result = await updateProfile(values)
    setIsLoading(false)

    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' })
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-12"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">

        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">Nombre completo</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              {...register('fullName')}
              placeholder="Tu nombre completo"
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-zinc-800 transition-all font-medium text-slate-900 dark:text-white"
            />
          </div>
          {errors.fullName && <p className="text-xs text-red-500 font-bold px-2">{errors.fullName.message}</p>}
        </div>

        {/* Whatsapp */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">WhatsApp</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              {...register('whatsapp')}
              placeholder="54 9 11 ..."
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-zinc-800 transition-all font-medium text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Instagram */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">Instagram</label>
          <div className="relative">
            <InstagramIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              {...register('instagram')}
              placeholder="usuario_sin_@"
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-zinc-800 transition-all font-medium text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Country */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">País</label>
          <div className="relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              {...register('country')}
              placeholder="Ej: Argentina"
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-zinc-800 transition-all font-medium text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* City */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">Ciudad / Zona</label>
          <div className="relative">
            <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              {...register('locationCity')}
              placeholder="Ej: Buenos Aires"
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-zinc-800 transition-all font-medium text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Location GPS */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">Ubicación GPS</label>
          <Button
            type="button"
            variant="outline"
            onClick={handleGetLocation}
            disabled={isCapturingLocation}
            className={cn(
              "w-full h-12 rounded-xl border-dashed border-2 border-slate-200 dark:border-zinc-800 bg-transparent hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all font-bold gap-3",
              capturedLat && "border-blue-500/50 bg-blue-500/5 text-blue-600 dark:text-blue-400 border-solid"
            )}
          >
            {isCapturingLocation ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Localizando...</>
            ) : capturedLat ? (
              <><MapPin className="h-4 w-4" /> Ubicación fijada</>
            ) : (
              <><MapPin className="h-4 w-4" /> Capturar ubicación actual</>
            )}
          </Button>
        </div>
      </div>

      {/* Email Address Section (Inspiration Style) */}
      <div className="space-y-6 pt-10 border-t border-slate-100 dark:border-zinc-800">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Mi dirección de correo</h3>

        <div className="flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white">{initialData.email || 'correo@ejemplo.com'}</p>
            <p className="text-xs text-slate-500 dark:text-zinc-500 font-medium">Hace 1 mes</p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6">
        <Button
          type="submit"
          disabled={isLoading}
          className="h-12 px-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-zinc-900 font-bold shadow-lg shadow-slate-900/10 active:scale-95 transition-all"
        >
          {isLoading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
          Guardar cambios
        </Button>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={cn(
              "fixed bottom-8 right-8 p-4 rounded-xl shadow-2xl border flex items-center gap-3 z-50 bg-white dark:bg-zinc-900",
              message.type === 'success' ? 'border-emerald-100 text-emerald-800' : 'border-red-100 text-red-800'
            )}
          >
            <div className={cn("w-2.5 h-2.5 rounded-full", message.type === 'success' ? 'bg-emerald-500' : 'bg-red-500')} />
            <p className="text-sm font-bold">{message.text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  )
}
