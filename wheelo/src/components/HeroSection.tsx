'use client'
import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from "motion/react"
import { Bike, Bus, Car, Truck, ArrowRight } from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useRouter } from 'next/navigation'
import confetti from 'canvas-confetti'
import AnimatedBackground from './AnimatedBackground'

const VEHICLE_ICONS = [
  { Icon: Bike, label: "Bikes", delay: 0 },
  { Icon: Car, label: "Cars", delay: 0.15 },
  { Icon: Bus, label: "Vans", delay: 0.3 },
  { Icon: Truck, label: "Trucks", delay: 0.45 },
]

function HeroSection({ onAuthRequired }: { onAuthRequired: () => void }) {
  const { userData } = useSelector((state: RootState) => state.user)
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll parallax effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const handleBookNow = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#ffffff', '#38bdf8', '#818cf8', '#34d399'],
      })
    } catch {}

    if (!userData) {
      onAuthRequired()
    } else {
      router.push("/user/book")
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-[#09090b] text-white flex items-center justify-center"
    >
      {/* Background Image with parallax */}
      <motion.div
        style={{ y: heroY }}
        className="absolute inset-0 bg-cover bg-center opacity-30"
      >
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: "url('/heroImage.jpg')" }}
        />
      </motion.div>

      {/* Animated Glowing Aurora Blobs (Continuous Loop Animation) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-blue-600/20 rounded-full blur-[130px] animate-pulse-glow" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[28rem] h-[28rem] bg-purple-600/15 rounded-full blur-[130px] animate-pulse-glow"
          style={{ animationDelay: '2.5s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] animate-pulse-glow"
          style={{ animationDelay: '5s' }}
        />
      </div>

      {/* Interactive Particle Canvas Background */}
      <AnimatedBackground />

      {/* Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#09090b] z-0" />

      {/* Main Clean Hero Content */}
      <motion.div
        style={{ opacity: heroOpacity }}
        className="relative z-10 max-w-4xl mx-auto px-4 py-28 text-center flex flex-col items-center justify-center"
      >
        {/* Main Clean Title */}
        <motion.h1
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="text-white font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-none"
        >
          Book Any{" "}
          <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-300 bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(245,158,11,0.3)]">
            Vehicle
          </span>
        </motion.h1>

        {/* Clean Subtitle */}
        <motion.p
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-gray-300 text-lg sm:text-xl font-normal max-w-xl"
        >
          From daily rides to heavy transport — all in one platform.
        </motion.p>

        {/* Floating Animated Vehicle Icons (Looping Float) */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-10 flex items-center justify-center gap-4 sm:gap-6"
        >
          {VEHICLE_ICONS.map(({ Icon, label, delay }, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay,
              }}
              whileHover={{ scale: 1.15, y: -12 }}
              className="group flex flex-col items-center gap-2 cursor-pointer"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-gray-200 group-hover:text-white group-hover:bg-white/20 group-hover:border-white/30 transition-all shadow-lg">
                <Icon size={26} strokeWidth={1.8} />
              </div>
              <span className="text-[11px] font-semibold text-gray-400 group-hover:text-white transition">
                {label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Clean Magnetic Book Now CTA Button */}
        <motion.button
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBookNow}
          className="mt-12 px-10 py-4 bg-white text-black rounded-full font-bold text-base shadow-[0_10px_35px_rgba(255,255,255,0.25)] hover:bg-zinc-100 transition-all flex items-center gap-2.5 group cursor-pointer"
        >
          <span>Book Now</span>
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </motion.button>
      </motion.div>
    </div>
  )
}

export default HeroSection
