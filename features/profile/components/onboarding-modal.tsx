'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { cn } from '@/lib/utils'
import { OnboardingForm } from './onboarding-form'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/types/card'
import { completeOnboarding } from '../actions/onboarding-actions'
import { ONBOARDING_STEPS } from './onboarding-steps-data'

interface OnboardingModalProps {
  user: User
  profile: Profile
}

export function OnboardingModal({ user, profile }: OnboardingModalProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const totalSteps = ONBOARDING_STEPS.length

  useEffect(() => {
    if (user && profile && !profile.onboarding_completed) {
      setOpen(true)
    }
  }, [user, profile])

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps))

  const handleSkipOrClose = async () => {
    // Mark as completed in DB even if they skip/close at the final step
    await completeOnboarding()
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        // Only allow closing at the final step and call mark as completed
        if (!isOpen && step === totalSteps) {
          handleSkipOrClose()
        }
      }}
    >
      <DialogContent
        className="sm:max-w-5xl p-0 overflow-hidden border-none shadow-2xl rounded-[2.5rem] outline-none"
        onPointerDownOutside={(e) => { if (step < totalSteps) e.preventDefault() }}
        onEscapeKeyDown={(e) => { if (step < totalSteps) e.preventDefault() }}
        showCloseButton={step === totalSteps}
      >
        <div className="relative bg-white dark:bg-zinc-950 flex flex-col md:flex-row min-h-[550px]">

          {/* ── LEFT SECTION: Visual / Branding (Refactored) ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`visual-${step}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={cn(
                "hidden md:flex w-[35%] p-12 flex-col justify-between bg-linear-to-b relative overflow-hidden transition-colors duration-700",
                ONBOARDING_STEPS[step - 1].accent
              )}
            >
              <div className="relative z-10">
                <div className="w-12 h-1 bg-slate-900/10 dark:bg-white/10 rounded-full mb-8" />
                <p className="text-[10px] font-black tracking-[0.3em] text-slate-400 dark:text-zinc-500 uppercase">
                  Paso {step} de {totalSteps}
                </p>
              </div>

              <div className="relative z-10 flex items-center justify-center py-12">
                {ONBOARDING_STEPS[step - 1].visual}
              </div>

              <div className="relative z-10">
                <h1 className="text-7xl font-black tracking-tighter opacity-10 leading-none">
                  {ONBOARDING_STEPS[step - 1].imageText}
                </h1>
              </div>

              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full" />
            </motion.div>
          </AnimatePresence>

          {/* ── RIGHT SECTION: Content ── */}
          <div className="flex-1 flex flex-col relative">

            <div className="absolute top-8 right-12 flex gap-1.5 z-20">
              {ONBOARDING_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500",
                    i + 1 === step ? "w-8 bg-emerald-500" : "w-1.5 bg-slate-100 dark:bg-zinc-800"
                  )}
                />
              ))}
            </div>

            <div className="flex-1 flex flex-col justify-center p-8 md:p-16">
              <AnimatePresence mode="wait">
                {step < totalSteps ? (
                  <motion.div
                    key={`step-${step}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-900 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        {ONBOARDING_STEPS[step - 1].label}
                      </div>
                      <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-br from-slate-900 via-slate-800 to-emerald-600 dark:from-white dark:via-zinc-200 dark:to-emerald-400 leading-[1.1]">
                        {ONBOARDING_STEPS[step - 1].title}
                      </h2>
                      <p className="text-slate-500 dark:text-zinc-400 text-lg font-medium leading-relaxed max-w-md">
                        {ONBOARDING_STEPS[step - 1].desc}
                      </p>
                    </div>

                    <div className="pt-4">
                      <Button
                        onClick={nextStep}
                        className="h-16 px-12 cursor-pointer rounded-2xl font-black text-lg gap-3 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all group"
                      >
                        {step === 1 ? 'Empezar aventura' : 'Siguiente paso'}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="final-step"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <OnboardingForm
                      user={user}
                      profile={profile}
                      onSuccess={() => setOpen(false)}
                      onSkip={handleSkipOrClose}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes scan {
            0% { top: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
          }
          @keyframes radar {
            0% { transform: scale(0.5); opacity: 0; }
            50% { opacity: 0.5; }
            100% { transform: scale(1.5); opacity: 0; }
          }
          @keyframes swap-left {
            0%, 100% { transform: translateX(-32px) rotate(-12deg); z-index: 10; }
            50% { transform: translateX(32px) rotate(12deg); z-index: 0; }
          }
          @keyframes swap-right {
            0%, 100% { transform: translateX(32px) rotate(12deg); z-index: 10; }
            50% { transform: translateX(-32px) rotate(-12deg); z-index: 0; }
          }
        `}} />
      </DialogContent>
    </Dialog>
  )
}
