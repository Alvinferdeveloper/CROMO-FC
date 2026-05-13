'use client'

import { useState, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cardSchema, type CardValues } from '../schemas/card-schema'
import { createCardPost } from '../actions/card-actions'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  MapPin, Camera, Info, Loader2, User, Hash,
  Flag, Navigation, ArrowLeftRight, CheckCircle2,
  ImageIcon
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { CameraCapture } from './camera-capture'
import { TeamSelector } from './team-selector'
import { useRouter } from 'next/navigation'

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
      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/my-cards')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

        {/* ── Left side: Image capture ── */}
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
                className={`relative aspect-4/5 w-full lg:max-w-md mx-auto rounded-[3rem] flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-[border-color,background-color,box-shadow] duration-300 group
                  ${preview
                    ? 'shadow-[0_20px_40px_-15px_rgba(var(--primary),0.15)] border-2 border-primary/50 bg-primary/5'
                    : 'border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 hover:border-primary/50'
                  }
                  ${errors.image ? 'border-destructive bg-destructive/10' : ''}
                `}
                style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
              >
                {preview ? (
                  <div className="absolute inset-0 w-full h-full group">
                    <Image src={preview} alt="Preview" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center backdrop-blur-sm gap-4">
                      <Button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setIsCameraActive(true); }}
                        className="rounded-full bg-white text-black hover:bg-white/90 font-bold active:scale-[0.97] transition-transform duration-200"
                        style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
                      >
                        <Camera className="mr-2 h-4 w-4" /> Tomar otra
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                        className="rounded-full bg-white/10 text-white border-white/30 hover:bg-white/20 font-bold active:scale-[0.97] transition-transform duration-200"
                        style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
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
                        className="w-16 h-16 rounded-3xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-110 active:scale-[0.97] transition-transform duration-200"
                        style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
                      >
                        <Camera className="h-7 w-7" />
                      </div>
                      <div
                        onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                        className="w-16 h-16 rounded-3xl bg-card text-muted-foreground shadow-md border border-border flex items-center justify-center hover:scale-110 active:scale-[0.97] transition-transform duration-200"
                        style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
                      >
                        <ImageIcon className="h-7 w-7" />
                      </div>
                    </div>
                    <p className="font-bold text-lg text-foreground mb-1">
                      Sube tu cromo
                    </p>
                    <p className="text-sm font-medium text-muted-foreground">
                      Usa la cámara o elige un archivo
                    </p>
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
            <p className="text-xs font-bold text-destructive text-center animate-pulse">
              ⚠️ Tienes que subir la foto del cromo para continuar.
            </p>
          )}

          {/* Professional tip box */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-3.5 max-w-sm mx-auto w-full">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
              <Info className="h-4 w-4 text-amber-500" />
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400 leading-relaxed font-medium pt-0.5">
              <strong className="block text-amber-700 dark:text-amber-500 mb-0.5">Tip para un mejor cambio:</strong>
              Asegúrate de que haya buena luz y evita mostrar objetos de fondo. Las fotos claras se cambian más rápido.
            </p>
          </div>
        </div>

        {/* ── Right side: form ── */}
        <div className="flex flex-col gap-6">

          {/* Player Info */}
          <div className="space-y-4">
            <div className="space-y-1.5 group">
              <label className="text-xs font-bold text-muted-foreground flex justify-between">
                Jugador <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                <input
                  {...register('playerName')}
                  placeholder="Ej: Lionel Messi"
                  className={`w-full h-12 pl-11 pr-4 rounded-xl bg-muted border ${errors.playerName ? 'border-destructive focus:border-destructive' : 'border-transparent focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/20'} outline-none transition-[border-color,background-color,box-shadow] duration-200 font-semibold text-foreground placeholder:font-medium placeholder:text-muted-foreground/70`}
                />
              </div>
              {errors.playerName && <p className="text-[10px] font-bold text-destructive">{errors.playerName.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 group">
                <label className="text-xs font-bold text-muted-foreground flex justify-between">
                  N° de Cromo <span className="text-[9px] font-medium opacity-60">(Álbum)</span>
                </label>
                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                  <input
                    {...register('cardNumber')}
                    placeholder="Ej: ARG 10 o 542"
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-muted border border-transparent focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/20 outline-none transition-[border-color,background-color,box-shadow] duration-200 font-semibold text-foreground placeholder:font-medium placeholder:text-muted-foreground/70"
                  />
                </div>
              </div>

              <div className="space-y-1.5 group">
                <label className="text-xs font-bold text-muted-foreground flex justify-between">
                  Equipo <span className="text-destructive">*</span>
                </label>
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
                {errors.teamName && <p className="text-[10px] font-bold text-destructive">{errors.teamName.message}</p>}
              </div>
            </div>

            {/* Rarity Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground">
                Tipo de cromo / Rareza
              </label>
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
          <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" /> Dónde te encuentras
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative group">
                <Flag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                <input
                  {...register('country')}
                  placeholder="País"
                  className="w-full h-11 pl-9 pr-3 rounded-lg bg-muted border border-transparent focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-[border-color,background-color,box-shadow] duration-200 font-medium text-sm placeholder:text-muted-foreground/70"
                />
              </div>
              <div className="relative group">
                <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                <input
                  {...register('locationCity')}
                  placeholder="Ciudad / Zona"
                  className="w-full h-11 pl-9 pr-3 rounded-lg bg-muted border border-transparent focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-[border-color,background-color,box-shadow] duration-200 font-medium text-sm placeholder:text-muted-foreground/70"
                />
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGetLocation}
              disabled={isCapturingLocation}
              className={`w-full h-11 rounded-lg font-bold gap-2 border-dashed active:scale-[0.97] transition-[transform,background-color,border-color] duration-200
                ${capturedLat
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'hover:border-border hover:bg-muted text-muted-foreground'
                }
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

          {/* Block 3: What are you looking for? */}
          <div className="p-5 rounded-2xl bg-accent/30 border border-border space-y-3">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <ArrowLeftRight className="h-4 w-4 text-primary" /> ¿Qué buscas a cambio? <span className="text-destructive">*</span>
            </label>
            <textarea
              {...register('desiredTrade')}
              placeholder="Ej: Solo cambio por Cristiano Ronaldo, o me faltan 3 del Grupo B..."
              rows={3}
              className={`w-full p-4 rounded-xl bg-muted border ${errors.desiredTrade ? 'border-destructive' : 'border-transparent focus:border-primary'} focus:bg-background focus:ring-4 focus:ring-primary/10 outline-none transition-[border-color,background-color,box-shadow] duration-200 font-medium text-foreground resize-none placeholder:text-muted-foreground/70`}
            />
            {errors.desiredTrade && <p className="text-[10px] font-bold text-destructive">{errors.desiredTrade.message}</p>}
          </div>

        </div>
      </div>

      {/* Error handling */}
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-2xl text-sm font-bold border border-destructive/20 flex items-center justify-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="pt-4 border-t border-border">
        <Button
          type="submit"
          disabled={isLoading || !imageValue}
          className="w-full h-16 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 active:scale-[0.97] disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none transition-[transform,opacity,box-shadow] duration-200"
          style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
        >
          {isLoading ? (
            <span className="flex items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin" /> Publicando cromo...
            </span>
          ) : (
            'Publicar cromo'
          )}
        </Button>
        <p className="text-center text-xs font-medium text-muted-foreground mt-4">
          Al publicar, tu cromo será visible para todos los coleccionistas de tu zona.
        </p>
      </div>
    </form>
  )
}
