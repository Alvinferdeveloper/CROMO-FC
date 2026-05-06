'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cardSchema, type CardValues } from '../schemas/card-schema'
import { createCardPost } from '../actions/card-actions'
import Image from 'next/image'

export function UploadCardForm() {
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CardValues>({
    resolver: zodResolver(cardSchema),
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setValue('image', file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
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
    formData.append('image', data.image)

    const result = await createCardPost(formData)
    
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl mx-auto space-y-8 p-6 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Sube tu Cromo</h2>
        <p className="text-zinc-500">Comparte lo que tienes y lo que buscas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Lado Izquierdo: Imagen */}
        <div className="space-y-4">
          <label className="block text-sm font-medium">Foto del Cromo</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="aspect-[3/4] relative border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden hover:border-zinc-400 transition-colors bg-zinc-50 dark:bg-zinc-950"
          >
            {preview ? (
              <Image src={preview} alt="Preview" fill className="object-cover" />
            ) : (
              <div className="text-center p-4">
                <span className="text-4xl mb-2 block">📸</span>
                <p className="text-sm text-zinc-500">Haz clic para subir foto</p>
              </div>
            )}
          </div>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          {errors.image && <p className="text-sm text-red-500">{errors.image.message as string}</p>}
        </div>

        {/* Lado Derecho: Info */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nombre del Jugador</label>
            <input 
              {...register('playerName')}
              placeholder="Ej: Lionel Messi"
              className="w-full h-10 px-3 rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent"
            />
            {errors.playerName && <p className="text-sm text-red-500">{errors.playerName.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Número</label>
              <input 
                {...register('cardNumber')}
                placeholder="Ej: ARG 10"
                className="w-full h-10 px-3 rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Equipo</label>
              <input 
                {...register('teamName')}
                placeholder="Ej: Argentina"
                className="w-full h-10 px-3 rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent"
              />
              {errors.teamName && <p className="text-sm text-red-500">{errors.teamName.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">País</label>
              <input 
                {...register('country')}
                placeholder="Ej: México"
                className="w-full h-10 px-3 rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent"
              />
              {errors.country && <p className="text-sm text-red-500">{errors.country.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Ciudad / Zona</label>
              <input 
                {...register('locationCity')}
                placeholder="Ej: CDMX"
                className="w-full h-10 px-3 rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent"
              />
              {errors.locationCity && <p className="text-sm text-red-500">{errors.locationCity.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">¿Qué buscas a cambio?</label>
            <textarea 
              {...register('desiredTrade')}
              placeholder="Ej: Cambio por Cristiano Ronaldo o 3 del grupo C"
              rows={3}
              className="w-full p-3 rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent resize-none"
            />
            {errors.desiredTrade && <p className="text-sm text-red-500">{errors.desiredTrade.message}</p>}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 rounded-full font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isLoading ? 'Subiendo...' : 'Publicar Cromo'}
      </button>
    </form>
  )
}
