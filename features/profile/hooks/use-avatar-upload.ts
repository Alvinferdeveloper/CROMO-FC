'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { updateAvatarUrl } from '../actions/avatar-actions'

/**
 * Custom hook to handle real-time avatar upload to Supabase Storage.
 */
export function useAvatarUpload(userId: string) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const uploadAvatar = async (file: File) => {
    setIsUploading(true)
    setError(null)

    try {
      const fileExt = file.name.split('.').pop()
      const filePath = `${userId}/${Math.random()}.${fileExt}`

      // 1. Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw new Error('Error al subir la imagen')

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // 3. Update profile record
      const result = await updateAvatarUrl(publicUrl)
      
      if (result.error) throw new Error(result.error)

      return publicUrl
    } catch (err: any) {
      setError(err.message)
      return null
    } finally {
      setIsUploading(false)
    }
  }

  return { uploadAvatar, isUploading, error }
}
