'use client'

import { useState, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cardSchema, type CardValues } from '../schemas/card-schema'
import { createCardPost } from '../actions/card-actions'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  MapPin, Camera, Loader2, User, Hash,
  ArrowLeftRight, Sparkles, ImageIcon,
  CheckCircle2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { CameraCapture } from './camera-capture'
import { TeamSelector } from './team-selector'
import { useRouter } from 'next/navigation'

import {
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface UploadCardFormProps {
  onSuccess?: () => void
}

export function UploadCardForm({ onSuccess }: UploadCardFormProps) {
  const router = useRouter()
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isCapturingLocation, setIsCapturingLocation] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<CardValues>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      rarity: 'Normal',
    }
  })

  const capturedLat = watch('lat')
  const imageValue = watch('image')

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setValue('image', file, { shouldValidate: true })
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleGetLocation = () => {
    setIsCapturingLocation(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('lat', position.coords.latitude)
          setValue('lng', position.coords.longitude)
          setIsCapturingLocation(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsCapturingLocation(false)
        }
      )
    }
  }

  const onSubmit = async (data: CardValues) => {
    setIsLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('playerName', data.playerName)
    formData.append('cardNumber', data.cardNumber || '')
    formData.append('teamName', data.teamName)
    formData.append('albumName', data.albumName || '')
    formData.append('description', data.description || '')
    formData.append('desiredTrade', data.desiredTrade)
    formData.append('country', data.country)
    formData.append('locationCity', data.locationCity)
    if (data.lat) formData.append('lat', data.lat.toString())
    if (data.lng) formData.append('lng', data.lng.toString())
    formData.append('rarity', data.rarity)
    formData.append('image', data.image)

    const result = await createCardPost(formData)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      router.refresh()
      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/my-cards')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] min-h-[600px]">

        {/* ── COLUMNA IZQUIERDA: Contexto e Imagen ── */}
        <div className="p-6 sm:p-10 lg:p-16 bg-slate-50/50 dark:bg-zinc-900/30 lg:border-r border-slate-100 dark:border-zinc-800">
          <DialogHeader className="mb-12 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/20 mb-6">
              Nuevo Intercambio
            </div>

            <DialogTitle className="text-4xl sm:text-5xl font-black tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-linear-to-br from-slate-900 via-slate-800 to-emerald-600 dark:from-white dark:via-zinc-200 dark:to-emerald-400">
              Publica tu <span className="text-emerald-500 italic">repetida</span>
            </DialogTitle>

            <div className="h-1 w-12 bg-emerald-500/30 rounded-full mt-6 mb-2 hidden lg:block" />

            <p className="text-sm sm:text-base text-slate-500 dark:text-zinc-400 font-medium max-w-lg mt-4 leading-relaxed">
              Convierte tus duplicados en <span className="text-slate-900 dark:text-white font-bold">nuevas oportunidades</span>. El álbum no se llenará solo.
            </p>
          </DialogHeader>

          {/* Photo Capture Section */}
          <div className="flex flex-col gap-6">
            <AnimatePresence mode="wait">
              {isCameraActive ? (
                <motion.div
                  key="camera"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-100"
                >
                  <CameraCapture
                    onCapture={(file) => {
                      setValue('image', file, { shouldValidate: true })
                      const reader = new FileReader()
                      reader.onloadend = () => setPreview(reader.result as string)
                      reader.readAsDataURL(file)
                      setIsCameraActive(false)
                    }}
                    onClose={() => setIsCameraActive(false)}
                  />
                </motion.div>
              ) : (
                <div
                  className={`relative aspect-4/5 w-full max-w-sm mx-auto lg:mx-0 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all duration-500 group
                    ${preview
                      ? 'shadow-2xl shadow-emerald-500/10 border-2 border-emerald-500/50 bg-emerald-500/5'
                      : 'border-2 border-dashed border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:border-emerald-500/50'
                    }
                    ${errors.image ? 'border-red-500 bg-red-500/5' : ''}
                  `}
                >
                  {preview ? (
                    <div className="absolute inset-0 w-full h-full group">
                      <Image src={preview} alt="Preview" fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center backdrop-blur-sm gap-4">
                        <Button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setIsCameraActive(true); }}
                          className="rounded-full bg-white text-black hover:bg-white/90 font-bold active:scale-[0.95] transition-transform"
                        >
                          <Camera className="mr-2 h-4 w-4" /> Tomar otra
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                          className="rounded-full bg-white/10 text-white border-white/30 hover:bg-white/20 font-bold active:scale-[0.95] transition-transform"
                        >
                          <ImageIcon className="mr-2 h-4 w-4" /> Subir archivo
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-8 flex flex-col items-center justify-center h-full w-full">
                      <div className="flex gap-4 mb-6">
                        <div
                          onClick={(e) => { e.stopPropagation(); setIsCameraActive(true); }}
                          className="w-14 h-14 rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                        >
                          <Camera className="h-6 w-6" />
                        </div>
                        <div
                          onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                          className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-800 text-slate-400 shadow-md border border-slate-100 dark:border-zinc-700 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                        >
                          <ImageIcon className="h-6 w-6" />
                        </div>
                      </div>
                      <p className="font-bold text-slate-900 dark:text-white">Sube la foto</p>
                    </div>
                  )}
                </div>
              )}
            </AnimatePresence>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />

            {errors.image && (
              <p className="text-[10px] font-black text-red-500 text-center uppercase tracking-widest">
                La foto es obligatoria
              </p>
            )}
          </div>
        </div>

        {/* ── COLUMNA DERECHA: Datos del Formulario ── */}
        <div className="p-6 sm:p-10 lg:p-16 flex flex-col gap-8">

          {/* Player Info */}
          <div className="space-y-6">
            <div className="space-y-2 group">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                Información del Jugador
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  {...register('playerName')}
                  placeholder="Nombre completo del jugador"
                  className={`w-full h-12 pl-11 pr-4 rounded-xl bg-muted border ${errors.playerName ? 'border-destructive focus:border-destructive' : 'border-transparent focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/20'} outline-none transition-[border-color,background-color,box-shadow] duration-200 font-semibold text-foreground placeholder:font-medium placeholder:text-muted-foreground/70`}
                />
              </div>
              {errors.playerName && <p className="text-[10px] font-bold text-red-500">{errors.playerName.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 group">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">N° Cromo</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    {...register('cardNumber')}
                    placeholder="Ej: ARG 10"
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-muted border border-transparent focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/20 outline-none transition-[border-color,background-color,box-shadow] duration-200 font-semibold text-foreground placeholder:font-medium placeholder:text-muted-foreground/70"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">Equipo</label>
                <Controller
                  name="teamName"
                  control={control}
                  render={({ field }) => (
                    <TeamSelector
                      value={field.value}
                      onChange={field.onChange}
                      error={!!errors.teamName}
                    />
                  )}
                />
              </div>
            </div>

            {/* Rarity */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">Rareza / Edición</label>
              <div className="grid grid-cols-4 gap-2">
                {(['Normal', 'Bronce', 'Plata', 'Oro'] as const).map((r) => {
                  const isActive = watch('rarity') === r || (!watch('rarity') && r === 'Normal')
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setValue('rarity', r)}
                      className={`h-11 rounded-xl text-[11px] font-bold tracking-tight border active:scale-[0.97] transition-[transform,background-color,border-color] duration-200
                        ${isActive
                          ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/20'
                          : 'border-border bg-card text-muted-foreground hover:border-muted-foreground/30'
                        }
                      `}
                      style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
                    >
                      {r}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="rounded-[2rem] bg-slate-50/50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500 flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" /> Ubicación
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                {...register('country')}
                placeholder="País"
                className="w-full h-11 pl-9 pr-3 rounded-lg bg-muted border border-transparent focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-[border-color,background-color,box-shadow] duration-200 font-medium text-sm placeholder:text-muted-foreground/70"
              />
              <input
                {...register('locationCity')}
                placeholder="Ciudad"
                className="w-full h-11 pl-9 pr-3 rounded-lg bg-muted border border-transparent focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-[border-color,background-color,box-shadow] duration-200 font-medium text-sm placeholder:text-muted-foreground/70"
              />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGetLocation}
              disabled={isCapturingLocation}
              className={`w-full h-11 rounded-lg font-bold gap-2 border-dashed active:scale-[0.97] transition-[transform,background-color,border-color] duration-200
                ${capturedLat ? 'border-primary bg-primary/10 text-primary' : 'hover:border-border hover:bg-muted text-muted-foreground'}
              `}
              style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
            >
              {isCapturingLocation ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Buscando señal...</>
              ) : capturedLat ? (
                <><CheckCircle2 className="h-4 w-4" /> Ubicación guardada</>
              ) : (
                <><MapPin className="h-4 w-4" /> Auto-completar con GPS</>
              )}
            </Button>
          </div>

          {/* Trade Info */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 flex items-center gap-2">
              <ArrowLeftRight className="h-3.5 w-3.5 text-emerald-500" /> ¿Qué buscas a cambio?
            </label>
            <textarea
              {...register('desiredTrade')}
              placeholder="Ej: Solo cambio por Lionel Messi..."
              rows={3}
              className={`w-full p-4 rounded-xl bg-muted border ${errors.desiredTrade ? 'border-destructive' : 'border-transparent focus:border-primary'} focus:bg-background focus:ring-4 focus:ring-primary/10 outline-none transition-[border-color,background-color,box-shadow] duration-200 font-medium text-foreground resize-none placeholder:text-muted-foreground/70`}
            />
          </div>

          {/* Action */}
          <div className="pt-4 mt-auto">
            <Button
              type="submit"
              disabled={isLoading || !imageValue}
              className="w-full h-16 rounded-2xl cursor-pointer font-bold text-lg shadow-xl shadow-primary/20 active:scale-[0.97] disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none transition-[transform,opacity,box-shadow] duration-200"
              style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
            >
              {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
              {isLoading ? 'Publicando...' : 'Publicar cromo'}
            </Button>

            {error && <p className="text-center text-xs font-bold text-red-500 mt-4">⚠️ {error}</p>}
          </div>
        </div>
      </div>
    </form>
  )
}
