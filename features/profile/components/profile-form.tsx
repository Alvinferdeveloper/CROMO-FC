'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema, type ProfileValues } from '../schemas/profile-schema'
import { updateProfile } from '../actions/profile-actions'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MapPin, CheckCircle2, Loader2 } from 'lucide-react'

interface ProfileFormProps {
  initialData: any
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

  const capturedLat = watch('lat')

  const handleGetLocation = () => {
    setIsCapturingLocation(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('lat', position.coords.latitude)
          setValue('lng', position.coords.longitude)
          setIsCapturingLocation(false)
        },
        () => setIsCapturingLocation(false)
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl mx-auto p-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tighter">Tu Perfil</h1>
        <p className="text-muted-foreground text-sm">Configura tu ubicación base y métodos de contacto</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-bold uppercase tracking-widest text-slate-500 text-[10px]">Nombre completo</label>
          <input 
            {...register('fullName')}
            className="w-full h-11 px-4 rounded-xl border bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all"
          />
          {errors.fullName && <p className="text-xs text-red-500 font-bold">{errors.fullName.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-slate-500 text-[10px]">País</label>
            <input 
              {...register('country')}
              className="w-full h-11 px-4 rounded-xl border bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-slate-500 text-[10px]">Ciudad / Zona</label>
            <input 
              {...register('locationCity')}
              className="w-full h-11 px-4 rounded-xl border bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>
        </div>

        <Button 
          type="button" 
          variant="outline" 
          onClick={handleGetLocation}
          disabled={isCapturingLocation}
          className={`w-full h-12 rounded-xl border-dashed gap-2 font-bold transition-all ${capturedLat ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : ''}`}
        >
          {isCapturingLocation ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Buscando...</>
          ) : capturedLat ? (
            <><CheckCircle2 className="h-4 w-4" /> Ubicación base fijada ✓</>
          ) : (
            <><MapPin className="h-4 w-4" /> Fijar ubicación base con GPS</>
          )}
        </Button>

        <p className="text-[11px] text-muted-foreground font-medium px-1 leading-relaxed">
          ✨ Fijar tu ubicación nos permite mostrarte automáticamente los cromos más cercanos y ayudarte a completar tu álbum más rápido.
        </p>

        <div className="pt-6 border-t space-y-4">
          <h3 className="font-black text-sm uppercase tracking-tighter">Métodos de Contacto</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 text-[10px]">WhatsApp (con código de país)</label>
            <input 
              {...register('whatsapp')}
              placeholder="+54 9 11 ..."
              className="w-full h-11 px-4 rounded-xl border bg-transparent focus:ring-2 focus:ring-primary text-[#25D366] font-bold outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 text-[10px]">Instagram (Sin @)</label>
            <input 
              {...register('instagram')}
              placeholder="tu_usuario"
              className="w-full h-11 px-4 rounded-xl border bg-transparent focus:ring-2 focus:ring-primary font-bold outline-none"
            />
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl text-sm font-bold border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
          {message.text}
        </div>
      )}

      <Button type="submit" disabled={isLoading} className="w-full h-14 rounded-2xl text-lg font-black shadow-xl shadow-primary/20">
        {isLoading ? 'Guardando...' : 'Guardar Cambios'}
      </Button>
    </form>
  )
}
