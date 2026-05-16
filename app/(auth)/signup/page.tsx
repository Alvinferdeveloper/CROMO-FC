import { SignupForm } from '@/features/auth/components/signup-form'
import Image from 'next/image'
import Link from 'next/link'

export default function SignupPage() {
  return (
    <div className="flex min-h-screen bg-background">

      {/* Left Column: Form */}
      <div className="w-full lg:w-[45%] flex flex-col px-6 lg:px-12 xl:px-24">
        {/* Simple Header Logo */}
        <div className="pt-8 pb-4">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="relative w-10 h-10 group-hover:rotate-6 transition-transform">
              <Image
                src="/images/logo.png"
                alt="Cromo FC Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-black text-xl tracking-tighter text-foreground">
              CROMO FC
            </span>
          </Link>
        </div>

        {/* Center the form vertically */}
        <div className="flex-1 flex items-center justify-center py-4">
          <SignupForm />
        </div>
      </div>

      {/* Right Column: Illustration Panel */}
      <div className="hidden lg:flex flex-1 bg-emerald-50 dark:bg-emerald-950/20 items-center justify-center p-12 relative overflow-hidden">
        {/* Soft decorative background circles */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-emerald-200/40 dark:bg-emerald-900/30 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-emerald-300/30 dark:bg-emerald-800/20 rounded-full blur-3xl" />

        <div className="max-w-xl w-full z-10 flex flex-col items-center">
          {/* Custom generated illustration */}
          <div className="relative w-full aspect-square max-w-md mb-12">
            <Image
              src="/illustrations/auth_hero.jpg"
              alt="Trading cards illustration"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>

          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black text-emerald-950 dark:text-emerald-50 tracking-tight">
              Empieza a construir tu colección hoy
            </h2>
            <p className="text-emerald-800/80 dark:text-emerald-200/70 font-medium text-lg max-w-md mx-auto">
              Encuentra los cromos que te faltan y ayuda a otros a completar su álbum.
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
