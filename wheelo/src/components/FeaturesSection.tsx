'use client'
import React, { useState } from 'react'
import { motion } from 'motion/react'
import { Zap, ShieldCheck, MapPin, BadgePercent, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'

const FEATURES = [
  {
    icon: Zap,
    title: "Instant 60-Second Matching",
    description: "Our smart matching algorithm connects you with nearest verified drivers and fleet owners in seconds.",
    badge: "Ultra Fast",
    accent: "from-blue-500/20 to-cyan-500/10",
    iconColor: "text-blue-400",
    points: ["Automated dispatch", "Zero waiting queues", "Live driver confirmation"]
  },
  {
    icon: ShieldCheck,
    title: "100% Inspected & Verified",
    description: "Every bike, car, and commercial truck undergoes comprehensive safety checks, RC verification, and driver background checks.",
    badge: "Safety First",
    accent: "from-emerald-500/20 to-teal-500/10",
    iconColor: "text-emerald-400",
    points: ["Verified documentation", "Comprehensive insurance", "Sanitized & road-tested"]
  },
  {
    icon: MapPin,
    title: "Precision Live GPS Tracking",
    description: "Track your vehicle’s journey in real-time with satellite GPS navigation, live ETA, and emergency assistance.",
    badge: "Real-Time",
    accent: "from-purple-500/20 to-indigo-500/10",
    iconColor: "text-purple-400",
    points: ["Live route progression", "Shareable trip link", "24/7 SOS helpline"]
  },
  {
    icon: BadgePercent,
    title: "Zero Hidden Charges",
    description: "Complete transparency with upfront fare estimation, fixed toll options, and digital receipts straight to your phone.",
    badge: "Fair Price",
    accent: "from-amber-500/20 to-orange-500/10",
    iconColor: "text-amber-400",
    points: ["Upfront price lock", "Multiple payment modes", "Instant GST tax invoices"]
  }
]

export default function FeaturesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="relative w-full bg-[#09090b] text-white py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-zinc-300 mb-4"
          >
            <Sparkles size={12} className="text-amber-400" />
            <span>Why Millions Choose WHEELO</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black tracking-tight leading-tight"
          >
            Engineered for Reliability, Built for Convenience
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed"
          >
            Experience a seamless rental and transport ecosystem designed to get you moving faster with absolute safety.
          </motion.p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon
            const isHovered = hoveredIndex === idx

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                whileHover={{ y: -6 }}
                className="group relative rounded-3xl p-6 sm:p-7 border border-white/10 bg-zinc-900/60 backdrop-blur-xl flex flex-col justify-between overflow-hidden transition-all duration-300"
              >
                {/* Dynamic Card Glow on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />

                <div className="relative z-10">
                  {/* Badge & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${feature.iconColor} group-hover:scale-110 transition-transform`}>
                      <Icon size={24} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 text-zinc-300 border border-white/10">
                      {feature.badge}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-white transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                </div>

                {/* Bullet Checklist */}
                <div className="relative z-10 pt-4 border-t border-white/10 flex flex-col gap-2">
                  {feature.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2 text-xs text-zinc-300">
                      <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
