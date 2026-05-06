'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema, type ProfileValues } from '../schemas/profile-schema'
import { updateProfile } from '../actions/profile-actions'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface ProfileFormProps {
  initialData: any
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const contactMethods = initialData.contact_methods || {}

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: initialData.full_name || '',
      whatsapp: contactMethods.whatsapp || '',
      instagram: contactMethods.instagram || '',
      locationCity: initialData.location_city || '',
      country: initialData.country || '',
    },
  })

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
        <h1 className="text-3xl font-bold">Tu Perfil</h1>
        <p className="text-muted-foreground">Configura cómo quieres que otros coleccionistas te contacten</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nombre completo</label>
          <input 
            {...register('fullName')}
            className="w-full h-11 px-4 rounded-xl border bg-transparent focus:ring-2 focus:ring-primary"
          />
          {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">País</label>
            <input 
              {...register('country')}
              className="w-full h-11 px-4 rounded-xl border bg-transparent focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Ciudad / Zona</label>
            <input 
              {...register('locationCity')}
              className="w-full h-11 px-4 rounded-xl border bg-transparent focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="pt-4 border-t space-y-4">
          <h3 className="font-bold text-lg">Métodos de Contacto</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">WhatsApp (con código de país, ej: +521...)</label>
            <input 
              {...register('whatsapp')}
              placeholder="+54 9 11 ..."
              className="w-full h-11 px-4 rounded-xl border bg-transparent focus:ring-2 focus:ring-primary text-[#25D366] font-semibold"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Instagram (Usuario sin @)</label>
            <input 
              {...register('instagram')}
              placeholder="tu_usuario"
              className="w-full h-11 px-4 rounded-xl border bg-transparent focus:ring-2 focus:ring-primary font-semibold"
            />
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-full text-lg font-bold">
        {isLoading ? 'Guardando...' : 'Guardar Cambios'}
      </Button>
    </form>
  )
}
