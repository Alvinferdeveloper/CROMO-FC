'use client'

import { useState, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateCardSchema, type UpdateCardValues } from '../schemas/card-schema'
import { updateCardPost } from '../actions/card-actions'
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
import { Card } from '@/types/card'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

import {
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface EditCardFormProps {
  card: Card
  onSuccess?: (updatedCard: Card) => void
}

const inputClasses = (hasError: boolean) => cn(
  "w-full h-11 pl-11 pr-4 rounded-xl bg-muted border outline-none transition-[border-color,background-color,box-shadow] duration-200 font-semibold text-foreground placeholder:font-medium placeholder:text-muted-foreground/70",
  hasError
    ? "border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/20"
    : "border-transparent focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/20"
)

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p className="text-[11px] font-bold text-destructive mt-1 pl-1">{message}</p>
  ) : null

export function EditCardForm({ card, onSuccess }: EditCardFormProps) {
  const router = useRouter()
  const [preview, setPreview] = useState<string | null>(card.image_url)
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
  } = useForm<UpdateCardValues>({
    resolver: zodResolver(updateCardSchema),
    defaultValues: {
      playerName: card.player_name,
      cardNumber: card.card_number || '',
      teamName: card.team_name,
      albumName: card.album_name || '',
      description: card.description || '',
      desiredTrade: card.desired_trade || '',
      country: card.country || '',
      locationCity: card.location_city || '',
      rarity: card.rarity,
      lat: card.location_lat || undefined,
      lng: card.location_lng || undefined,
    }
  })

  const capturedLat = watch('lat')

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
          setValue('lat', position.coords.latitude, { shouldValidate: true })
          setValue('lng', position.coords.longitude, { shouldValidate: true })
          setIsCapturingLocation(false)
        },
        (err) => {
          console.error("Error getting location:", err)
          setIsCapturingLocation(false)
        }
      )
    }
  }

  const onSubmit = async (data: UpdateCardValues) => {
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
    if (data.image) formData.append('image', data.image)

    const result = await updateCardPost(card.id, formData)

    if (result?.error) {
      setError(result.error)
      toast.error(result.error)
      setIsLoading(false)
    } else {
      toast.success('¡Cromo actualizado correctamente! ✨')
      router.refresh()
      if (onSuccess && result.data) onSuccess(result.data as Card)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] min-h-[600px]">

        {/* ── COLUMNA IZQUIERDA: Contexto e Imagen ── */}
        <div className="p-6 sm:p-10 lg:p-16 bg-slate-50/50 dark:bg-zinc-900/30 lg:border-r border-slate-100 dark:border-zinc-800">
          <DialogHeader className="mb-12 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] border border-blue-500/20 mb-6">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              Actualizar Cromo
            </div>

            <DialogTitle className="text-4xl sm:text-5xl font-black tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-linear-to-br from-slate-900 via-slate-800 to-blue-600 dark:from-white dark:via-zinc-200 dark:to-blue-400">
              Edita tu <span className="text-blue-500 italic">publicación</span>
            </DialogTitle>

            <div className="h-1 w-12 bg-blue-500/30 rounded-full mt-6 mb-2 hidden lg:block" />

            <p className="text-sm sm:text-base text-slate-500 dark:text-zinc-400 font-medium max-w-lg mt-4 leading-relaxed">
              Corrige errores o actualiza lo que buscas a cambio para atraer <span className="text-slate-900 dark:text-white font-bold">mejores ofertas</span>.
            </p>
          </DialogHeader>

          {/* Photo Capture Section */}
          <div className="flex flex-col gap-3">
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
                  className={cn(
                    "relative aspect-4/5 w-full max-w-sm mx-auto lg:mx-0 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all duration-500 group border-2",
                    preview
                      ? "shadow-2xl shadow-blue-500/10 border-blue-500/50 bg-blue-500/5"
                      : "border-dashed border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:border-blue-500/50"
                  )}
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
                          <ImageIcon className="mr-2 h-4 w-4" /> Cambiar foto
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-8 flex flex-col items-center justify-center h-full w-full">
                      <div className="flex gap-4 mb-6">
                        <div
                          onClick={(e) => { e.stopPropagation(); setIsCameraActive(true); }}
                          className="w-14 h-14 rounded-2xl bg-blue-500 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
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
                      <p className="font-bold text-slate-900 dark:text-white">Cambiar foto</p>
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
          </div>
        </div>

        {/* ── COLUMNA DERECHA: Datos del Formulario ── */}
        <div className="p-6 sm:p-10 lg:p-16 flex flex-col gap-8">

          {/* Player Info */}
          <div className="space-y-5">

            {/* Nombre del jugador */}
            <div className="space-y-1 group">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                Información del Jugador
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  {...register('playerName')}
                  placeholder="Nombre completo del jugador"
                  className={inputClasses(!!errors.playerName)}
                />
              </div>
              <FieldError message={errors.playerName?.message} />
            </div>

            {/* Equipo + N° Cromo */}
            <div className="grid grid-cols-2 gap-4">

              <div className="space-y-1 group">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">Equipo</label>
                <Controller
                  name="teamName"
                  control={control}
                  render={({ field }) => (
                    <TeamSelector
                      value={field.value}
                      onChange={(name, code) => {
                        field.onChange(name)
                        const currentNum = watch('cardNumber') || ''
                        const prefixRegex = /^[A-Z]{3}\s/
                        if (prefixRegex.test(currentNum)) {
                          setValue('cardNumber', currentNum.replace(prefixRegex, `${code} `), { shouldValidate: true })
                        } else if (!currentNum.trim()) {
                          setValue('cardNumber', `${code} `, { shouldValidate: true })
                        } else {
                          setValue('cardNumber', `${code} ${currentNum.trim()}`, { shouldValidate: true })
                        }
                      }}
                      error={!!errors.teamName}
                    />
                  )}
                />
                <FieldError message={errors.teamName?.message} />
              </div>

              <div className="space-y-1 group">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">N° Cromo</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    {...register('cardNumber')}
                    placeholder="Ej: ARG 10"
                    className={inputClasses(!!errors.cardNumber)}
                  />
                </div>
                <FieldError message={errors.cardNumber?.message} />
              </div>
            </div>

            {/* Rarity */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">Rareza / Edición</label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {(['Normal', 'Bronce', 'Plata', 'Oro'] as const).map((r) => {
                  const isActive = watch('rarity') === r || (!watch('rarity') && r === 'Normal')
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setValue('rarity', r)}
                      className={cn(
                        "h-11 rounded-xl text-[11px] font-bold tracking-tight border active:scale-[0.97] transition-[transform,background-color,border-color] duration-200",
                        isActive
                          ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/20"
                          : "border-border bg-card text-muted-foreground hover:border-muted-foreground/30"
                      )}
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
          <div className="rounded-[2rem] bg-slate-50/50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800 p-5 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500 flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" /> Ubicación
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {/* País */}
              <div className="space-y-1">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    {...register('country')}
                    placeholder="País"
                    className={cn(
                      "w-full h-11 pl-9 pr-3 rounded-lg bg-muted border outline-none transition-[border-color,background-color,box-shadow] duration-200 font-medium text-sm placeholder:text-muted-foreground/70",
                      errors.country
                        ? "border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/20"
                        : "border-transparent focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20"
                    )}
                  />
                </div>
                <FieldError message={errors.country?.message} />
              </div>

              {/* Ciudad */}
              <div className="space-y-1">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    {...register('locationCity')}
                    placeholder="Ciudad"
                    className={cn(
                      "w-full h-11 pl-9 pr-3 rounded-lg bg-muted border outline-none transition-[border-color,background-color,box-shadow] duration-200 font-medium text-sm placeholder:text-muted-foreground/70",
                      errors.locationCity
                        ? "border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/20"
                        : "border-transparent focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20"
                    )}
                  />
                </div>
                <FieldError message={errors.locationCity?.message} />
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGetLocation}
              disabled={isCapturingLocation}
              className={cn(
                "w-full h-11 rounded-lg font-bold gap-2 border-dashed active:scale-[0.97] transition-[transform,background-color,border-color] duration-200",
                capturedLat
                  ? "border-primary bg-primary/10 text-primary"
                  : "hover:border-border hover:bg-muted text-muted-foreground"
              )}
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
          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 flex items-center gap-2">
              <ArrowLeftRight className="h-3.5 w-3.5 text-blue-500" /> ¿Qué buscas a cambio?
            </label>
            <textarea
              {...register('desiredTrade')}
              placeholder="Ej: Solo cambio por Lionel Messi..."
              rows={3}
              className={cn(
                "w-full p-4 rounded-xl bg-muted border outline-none transition-[border-color,background-color,box-shadow] duration-200 font-medium text-foreground resize-none placeholder:text-muted-foreground/70",
                errors.desiredTrade
                  ? "border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/20"
                  : "border-transparent focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10"
              )}
            />
            <FieldError message={errors.desiredTrade?.message} />
          </div>

          {/* Action */}
          <div className="pt-4 mt-auto">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-16 rounded-2xl cursor-pointer font-bold text-lg shadow-xl shadow-primary/20 active:scale-[0.97] disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none transition-[transform,opacity,box-shadow] duration-200"
              style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
            >
              {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
              {isLoading ? 'Guardando cambios...' : 'Guardar cambios'}
            </Button>

            {error && <p className="text-center text-xs font-bold text-destructive mt-4">⚠️ {error}</p>}
          </div>
        </div>
      </div>
    </form>
  )
}
