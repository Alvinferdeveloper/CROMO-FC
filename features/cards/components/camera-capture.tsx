'use client'

import { useRef, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw, X, Check } from 'lucide-react'

interface CameraCaptureProps {
  onCapture: (file: File) => void
  onClose: () => void
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [])

  async function startCamera() {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1080 },
          height: { ideal: 1440 }
        },
        audio: false
      })
      setStream(newStream)
      if (videoRef.current) {
        videoRef.current.srcObject = newStream
        videoRef.current.onloadedmetadata = () => {
          setIsReady(true)
        }
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("No pudimos acceder a tu cámara. Asegúrate de dar permisos.")
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')

      if (context) {
        // Set canvas dimensions to match video stream
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw the current video frame to the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
        setCapturedImage(dataUrl)
        stopCamera()
      }
    }
  }

  const handleConfirm = () => {
    if (capturedImage) {
      // Convert dataUrl to File
      fetch(capturedImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "cromo-captura.jpg", { type: "image/jpeg" })
          onCapture(file)
        })
    }
  }

  const handleRetry = () => {
    setCapturedImage(null)
    setIsReady(false)
    startCamera()
  }

  return (
    <div className="fixed inset-0 z-100 bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* ── HEADER ── */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50 bg-linear-to-b from-black/80 to-transparent">
        <h3 className="text-white font-bold tracking-tight">Captura tu Cromo</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => { stopCamera(); onClose(); }}
          className="text-white hover:bg-white/10 rounded-full"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* ── VIEWFINDER ── */}
      <div className="relative w-full h-full flex items-center justify-center">
        {!capturedImage ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Visual Guide / Frame Overlay */}
            {isReady && (
              <div className="absolute inset-0 flex flex-center justify-center pointer-events-none">
                {/* Darkened background around the frame */}
                <div className="absolute inset-0 bg-black/40" style={{
                  clipPath: 'polygon(0% 0%, 0% 100%, 10% 100%, 10% 15%, 90% 15%, 90% 85%, 10% 85%, 10% 100%, 100% 100%, 100% 0%)'
                }} />

                {/* The central frame */}
                <div className="w-[80%] aspect-3/4 border-4 border-emerald-400 rounded-3xl shadow-[0_0_0_9999px_rgba(0,0,0,0.4)] relative">
                  {/* Corner marks */}
                  <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-2xl" />
                  <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-2xl" />
                  <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-2xl" />
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-2xl" />

                  {/* Instructions on frame */}
                  <div className="absolute inset-x-0 bottom-6 text-center">
                    <span className="bg-black/60 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-md border border-white/20">
                      Encuadra solo el cromo
                    </span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="p-8 text-center space-y-4">
                <p className="text-white font-medium">{error}</p>
                <Button onClick={onClose} variant="secondary">Volver</Button>
              </div>
            )}
          </>
        ) : (
          <img src={capturedImage} className="w-full h-full object-cover" alt="Captured" />
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {/* ── CONTROLS ── */}
      <div className="absolute bottom-0 left-0 right-0 p-10 flex items-center justify-center gap-8 z-50 bg-linear-to-t from-black/80 to-transparent">
        {!capturedImage ? (
          <button
            onClick={takePhoto}
            disabled={!isReady}
            className="w-20 h-20 rounded-full border-4 border-white p-1 transition-transform active:scale-90 disabled:opacity-50"
          >
            <div className="w-full h-full rounded-full bg-white shadow-xl" />
          </button>
        ) : (
          <div className="flex gap-4 w-full max-w-xs">
            <Button
              onClick={handleRetry}
              variant="outline"
              className="flex-1 rounded-2xl h-14 bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <RefreshCw className="mr-2 h-5 w-5" /> Repetir
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 rounded-2xl h-14 bg-emerald-500 hover:bg-emerald-600 text-white border-none font-bold"
            >
              <Check className="mr-2 h-5 w-5" /> Listo
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
