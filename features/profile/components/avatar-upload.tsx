'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { Camera, Loader2, User } from 'lucide-react'
import { useAvatarUpload } from '../hooks/use-avatar-upload'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface AvatarUploadProps {
  userId: string
  initialUrl?: string | null
}

export function AvatarUpload({ userId, initialUrl }: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { uploadAvatar, isUploading, error } = useAvatarUpload(userId)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await uploadAvatar(file)
    }
  }

  return (
    <div className="relative group">
      <div 
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={cn(
          "w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-zinc-900 bg-slate-100 dark:bg-zinc-800 shadow-2xl overflow-hidden relative cursor-pointer transition-all duration-500",
          !isUploading && "group-hover:scale-105 group-hover:-rotate-3 group-hover:shadow-emerald-500/10",
          isUploading && "opacity-80 grayscale"
        )}
      >
        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            >
              <Loader2 className="w-8 h-8 animate-spin text-white" />
            </motion.div>
          ) : (
            <motion.div 
              key="camera-overlay"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity"
            >
              <div className="flex flex-col items-center gap-1 text-white">
                <Camera className="w-6 h-6" />
                <span className="text-[10px] font-black uppercase tracking-widest">Cambiar</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {initialUrl ? (
          <Image src={initialUrl} alt="Avatar" fill sizes="(max-width: 768px) 128px, 160px" className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-slate-100 dark:bg-zinc-800 text-slate-300">
            <User className="w-12 h-12" />
          </div>
        )}
      </div>

      {/* Hidden input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Error Message */}
      {error && (
        <p className="absolute -bottom-6 left-0 right-0 text-[10px] text-red-500 font-bold text-center animate-pulse">
          {error}
        </p>
      )}

      {/* Animated status dot */}
      {!isUploading && (
        <div className="absolute bottom-1 right-2 w-8 h-8 rounded-full bg-emerald-500 border-4 border-white dark:border-zinc-950 z-20 flex items-center justify-center shadow-lg">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
        </div>
      )}
    </div>
  )
}
