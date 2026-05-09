'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cardSchema, type CardValues } from '../schemas/card-schema'
import { createCardPost } from '../actions/card-actions'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  MapPin, Camera, Info, Loader2, User, Hash,
  Shield, Flag, Navigation, ArrowLeftRight, CheckCircle2,
  ImageIcon
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { CameraCapture } from './camera-capture'

interface UploadCardFormProps {
  onSuccess?: () => void
}

export function UploadCardForm({ onSuccess }: UploadCardFormProps) {
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
    formState: { errors },
  } = useForm<CardValues>({
    resolver: zodResolver(cardSchema),
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
    formData.append('image', data.image)

    const result = await createCardPost(formData)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      if (onSuccess) onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">

        {/* ── Left side: image capture ── */}
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
                className={`relative aspect- w-full lg:max-w-md mx-auto rounded-[3rem] flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 group
                  ${preview
                    ? 'shadow-2xl shadow-emerald-500/20 border-2 border-emerald-500/50 bg-emerald-50'
                    : 'border-2 border-dashed border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:border-emerald-400'
                  }
                  ${errors.image ? 'border-red-400 bg-red-50' : ''}
                `}
              >
                {preview ? (
                  <div className="absolute inset-0 w-full h-full group">
                    <Image src={preview} alt="Preview" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center backdrop-blur-sm gap-3">
                      <Button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setIsCameraActive(true); }}
                        className="rounded-full bg-white text-slate-900 hover:bg-white/90 font-bold"
                      >
                        <Camera className="mr-2 h-4 w-4" /> Tomar otra
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                        className="rounded-full bg-white/10 text-white border-white/30 hover:bg-white/20 font-bold"
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
                        className="w-16 h-16 rounded-3xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        <Camera className="h-7 w-7" />
                      </div>
                      <div
                        onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                        className="w-16 h-16 rounded-3xl bg-white dark:bg-zinc-800 text-slate-600 dark:text-slate-300 shadow-md flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        <ImageIcon className="h-7 w-7" />
                      </div>
                    </div>
                    <p className="font-extrabold text-lg text-slate-800 dark:text-white mb-1">
                      Sube tu cromo
                    </p>
                    <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
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
            capture="environment"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          {errors.image && (
            <p className="text-xs font-bold text-red-500 text-center animate-pulse">
              ⚠️ Tienes que subir la foto del cromo para continuar.
            </p>
          )}

          {/* Professional tip box */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex gap-3.5 max-w-sm mx-auto w-full">
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center shrink-0">
              <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-xs text-amber-800 dark:text-amber-200/80 leading-relaxed font-medium pt-0.5">
              <strong className="block text-amber-900 dark:text-amber-200 mb-0.5">Tip para un mejor cambio:</strong>
              Asegúrate de que haya buena luz y evita mostrar objetos de fondo. Las fotos claras se cambian más rápido.
            </p>
          </div>
        </div>

        {/* ── Right side: form ── */}
        <div className="flex flex-col gap-6">

          {/* Block 1: Card data */}
          <div className="space-y-4">
            <div className="space-y-1.5 group">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 flex justify-between">
                Jugador <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  {...register('playerName')}
                  placeholder="Ej: Lionel Messi"
                  className={`w-full h-12 pl-11 pr-4 rounded-xl bg-slate-100 dark:bg-zinc-900 border ${errors.playerName ? 'border-red-300 focus:border-red-500' : 'border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-zinc-950 focus:ring-4 focus:ring-emerald-500/10'} outline-none transition-all font-semibold text-slate-800 dark:text-white placeholder:font-medium placeholder:text-slate-400`}
                />
              </div>
              {errors.playerName && <p className="text-[10px] font-bold text-red-500">{errors.playerName.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 group">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                  Número
                </label>
                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    {...register('cardNumber')}
                    placeholder="#10"
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-zinc-950 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-semibold text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5 group">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 flex justify-between">
                  Equipo <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    {...register('teamName')}
                    placeholder="Argentina"
                    className={`w-full h-12 pl-10 pr-4 rounded-xl bg-slate-100 dark:bg-zinc-900 border ${errors.teamName ? 'border-red-300 focus:border-red-500' : 'border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-zinc-950 focus:ring-4 focus:ring-emerald-500/10'} outline-none transition-all font-semibold text-slate-800 dark:text-white`}
                  />
                </div>
                {errors.teamName && <p className="text-[10px] font-bold text-red-500">{errors.teamName.message}</p>}
              </div>
            </div>
          </div>

          {/* Block 2: Location */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-400" /> Dónde te encuentras
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative group">
                <Flag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  {...register('country')}
                  placeholder="País"
                  className="w-full h-11 pl-9 pr-3 rounded-lg bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-medium text-sm"
                />
              </div>
              <div className="relative group">
                <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  {...register('locationCity')}
                  placeholder="Ciudad / Zona"
                  className="w-full h-11 pl-9 pr-3 rounded-lg bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-medium text-sm"
                />
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGetLocation}
              disabled={isCapturingLocation}
              className={`w-full h-11 rounded-lg font-bold gap-2 border-dashed transition-all
                ${capturedLat
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                  : 'hover:border-slate-400 hover:bg-slate-100 text-slate-600 dark:text-slate-300'
                }
              `}
            >
              {isCapturingLocation ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Buscando señal...</>
              ) : capturedLat ? (
                <><CheckCircle2 className="h-4 w-4" /> Ubicación Exacta Fijada</>
              ) : (
                <><MapPin className="h-4 w-4" /> Auto-completar con GPS</>
              )}
            </Button>
          </div>

          {/* Block 3: What are you looking for? */}
          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20 space-y-3">
            <label className="text-[11px] font-bold uppercase tracking-widest text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
              <ArrowLeftRight className="h-3.5 w-3.5" /> ¿Qué buscas a cambio? <span className="text-emerald-500">*</span>
            </label>
            <textarea
              {...register('desiredTrade')}
              placeholder="Ej: Solo cambio por Cristiano Ronaldo, o me faltan 3 del Grupo B..."
              rows={3}
              className={`w-full p-4 rounded-xl bg-white dark:bg-zinc-950 border ${errors.desiredTrade ? 'border-red-300' : 'border-emerald-100 dark:border-emerald-500/30'} focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-800 dark:text-white resize-none`}
            />
            {errors.desiredTrade && <p className="text-[10px] font-bold text-red-500">{errors.desiredTrade.message}</p>}
          </div>

        </div>
      </div>

      {/* Error handling */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl text-sm font-bold border border-red-200 dark:border-red-500/20 flex items-center justify-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="pt-4 border-t border-slate-200 dark:border-zinc-800">
        <Button
          type="submit"
          disabled={isLoading || !imageValue}
          className="w-full h-16 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none"
        >
          {isLoading ? (
            <span className="flex items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin" /> PUBLICANDO CROMO...
            </span>
          ) : (
            'PUBLICAR CROMO'
          )}
        </Button>
        <p className="text-center text-xs font-semibold text-slate-400 mt-4">
          Al publicar, tu cromo será visible para todos los coleccionistas de tu zona.
        </p>
      </div>
    </form>
  )
}