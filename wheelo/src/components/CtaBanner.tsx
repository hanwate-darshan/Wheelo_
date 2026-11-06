'use client'
import React from 'react'
import { motion } from 'motion/react'
import { ArrowRight, Sparkles, Shield, Clock, PhoneCall } from 'lucide-react'
import confetti from 'canvas-confetti'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

export default function CtaBanner({ onAuthRequired }: { onAuthRequired: () => void }) {
  const router = useRouter()
  const { userData } = useSelector((state: RootState) => state.user)

  const handleAction = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ffffff', '#3b82f6', '#10b981', '#f59e0b']
      })
    } catch {}

    if (!userData) {
      onAuthRequired()
    } else {
      router.push("/user/book")
    }
  }

  return (
    <section className="relative w-full bg-[#fafafa] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[2.5rem] bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-8 sm:p-14 lg:p-16 text-white overflow-hidden shadow-2xl border border-white/10"
        >
          {/* Animated decorative radiant light blobs */}
          <div className="absolute top-0 right-0 w-[28rem] h-[28rem] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600/15 rounded-full blur-[90px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-zinc-300 mb-6 backdrop-blur-md">
              <Sparkles size={13} className="text-yellow-400" />
              <span>Zero Waiting Time Guarantee</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
              Ready to Hit the Road? <br />
              <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                Book Your Ride in 60 Seconds.
              </span>
            </h2>

            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-8 max-w-xl">
              From quick bike rides to entire truck logistics fleets — join thousands of satisfied users riding daily with WHEELO.
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleAction}
                className="px-8 py-4 rounded-2xl bg-white text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xl hover:bg-zinc-100 transition-colors group cursor-pointer"
              >
                <span>Book Vehicle Now</span>
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/partner")}
                className="px-6 py-4 rounded-2xl bg-white/5 border border-white/15 text-white font-semibold text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <span>Become a Fleet Partner</span>
              </motion.button>
            </div>

            {/* Feature pills below */}
            <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-emerald-400 shrink-0" />
                <span>Verified Drivers & Vehicles</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-blue-400 shrink-0" />
                <span>24/7 Roadside Assistance</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall size={16} className="text-purple-400 shrink-0" />
                <span>Instant In-App Chat Support</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
