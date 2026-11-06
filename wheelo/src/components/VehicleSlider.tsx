'use client'
import React, { useRef, useState, useEffect } from 'react'
import { motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react"
import {
  Bike,
  Bus,
  Car,
  CarTaxiFront,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Truck,
  ArrowRight,
  Layers,
  Clock,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

interface VehicleCategory {
  id: string
  title: string
  desc: string
  Icon: React.ElementType
  tag: string
  group: 'all' | 'two-wheeler' | 'four-wheeler' | 'cargo'
  accentGlow: string
  borderGlow: string
  badgeColor: string
}

const VEHICLE_CATEGORIES: VehicleCategory[] = [
  {
    id: "all",
    title: "All Vehicles",
    desc: "Browse the full fleet",
    Icon: CarTaxiFront,
    tag: "Popular",
    group: "all",
    accentGlow: "from-blue-500/20 via-cyan-500/10 to-transparent",
    borderGlow: "group-hover:border-cyan-500/40",
    badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  },
  {
    id: "bikes",
    title: "Bikes",
    desc: "Fast & affordable rides",
    Icon: Bike,
    tag: "Quick",
    group: "two-wheeler",
    accentGlow: "from-emerald-500/20 via-teal-500/10 to-transparent",
    borderGlow: "group-hover:border-emerald-500/40",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  {
    id: "cars",
    title: "Cars",
    desc: "Comfortable city travel",
    Icon: Car,
    tag: "Comfort",
    group: "four-wheeler",
    accentGlow: "from-purple-500/20 via-indigo-500/10 to-transparent",
    borderGlow: "group-hover:border-purple-500/40",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
  {
    id: "suvs",
    title: "SUVs",
    desc: "Premium & spacious",
    Icon: Car,
    tag: "Premium",
    group: "four-wheeler",
    accentGlow: "from-amber-500/20 via-orange-500/10 to-transparent",
    borderGlow: "group-hover:border-amber-500/40",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  {
    id: "vans",
    title: "Vans",
    desc: "Family & group transport",
    Icon: Bus,
    tag: "Family",
    group: "four-wheeler",
    accentGlow: "from-rose-500/20 via-pink-500/10 to-transparent",
    borderGlow: "group-hover:border-rose-500/40",
    badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  },
  {
    id: "trucks",
    title: "Trucks",
    desc: "Heavy & commercial transport",
    Icon: Truck,
    tag: "Cargo",
    group: "cargo",
    accentGlow: "from-sky-500/20 via-blue-500/10 to-transparent",
    borderGlow: "group-hover:border-sky-500/40",
    badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  },
]

// 3D Tilt Card with Dynamic Mouse Spotlight & Glare
function TiltCard({
  category,
  index,
  isHovered,
  onHover,
  onClick,
}: {
  category: VehicleCategory
  index: number
  isHovered: boolean
  onHover: (idx: number | null) => void
  onClick: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 })

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 350, damping: 25 })
  const mouseYSpring = useSpring(y, { stiffness: 350, damping: 25 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / rect.width - 0.5
    const yPct = mouseY / rect.height - 0.5
    x.set(xPct)
    y.set(yPct)
    setSpotlightPos({ x: mouseX, y: mouseY })
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    onHover(null)
  }

  const Icon = category.Icon

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="group relative min-w-[270px] sm:min-w-[310px] flex-shrink-0 cursor-pointer select-none"
    >
      {/* Outer Card with Dynamic Glow Border */}
      <div
        className={`relative rounded-[2rem] p-7 h-full flex flex-col justify-between transition-all duration-500 overflow-hidden border bg-zinc-900/80 backdrop-blur-xl border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.45)] group-hover:-translate-y-2.5 ${category.borderGlow}`}
      >
        {/* Dynamic Mouse Spotlight Glare */}
        <div
          suppressHydrationWarning
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(400px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(255,255,255,0.08), transparent 70%)`,
          }}
        />

        {/* Ambient Top Gradient Glow */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${category.accentGlow} opacity-30 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
        />

        <div className="relative z-10">
          {/* Top Tag & Interactive Arrow */}
          <div className="flex items-center justify-between mb-8">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${category.badgeColor}`}
            >
              <Sparkles size={10} className="animate-pulse" />
              {category.tag}
            </span>

            <motion.div
              animate={{
                rotate: isHovered ? 45 : 0,
                scale: isHovered ? 1.15 : 1,
              }}
              transition={{ duration: 0.3 }}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 border border-white/15 text-zinc-300 group-hover:bg-white group-hover:text-black group-hover:border-white transition-all shadow-md"
            >
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </motion.div>
          </div>

          {/* Vehicle Icon in Floating Container */}
          <motion.div
            animate={{
              scale: isHovered ? 1.12 : 1,
              rotate: isHovered ? 4 : 0,
            }}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-white/5 border border-white/10 text-white shadow-inner group-hover:bg-white/15 group-hover:border-white/25 transition-all"
          >
            <Icon size={30} strokeWidth={1.7} />
          </motion.div>

          {/* Title & Description */}
          <h3 className="text-2xl font-black tracking-tight leading-snug mb-2 text-white group-hover:text-white transition-colors">
            {category.title}
          </h3>

          <p className="text-xs sm:text-sm font-normal leading-relaxed text-zinc-400 group-hover:text-zinc-300 transition-colors">
            {category.desc}
          </p>
        </div>

        {/* Bottom Interactive Booking CTA Link */}
        <div className="relative z-10 mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors flex items-center gap-1.5">
            <span>Book this class</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>
      </div>
    </motion.div>
  )
}

// Animated Counter with Smooth Easing
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-30px" })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const duration = 1400
    const increment = Math.max(1, Math.ceil(target / (duration / 25)))
    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 25)
    return () => clearInterval(timer)
  }, [isInView, target])

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  )
}

function VehicleSlider({ onAuthRequired }: { onAuthRequired?: () => void }) {
  const router = useRouter()
  const { userData } = useSelector((state: RootState) => state.user)
  const [hovered, setHovered] = useState<number | null>(null)
  const [activeFilter, setActiveFilter] = useState<'all' | 'two-wheeler' | 'four-wheeler' | 'cargo'>('all')
  const [scrollProgress, setScrollProgress] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)

  const filteredCategories = activeFilter === 'all'
    ? VEHICLE_CATEGORIES
    : VEHICLE_CATEGORIES.filter((c) => c.group === activeFilter || c.id === 'all')

  const handleCardClick = (catId: string) => {
    if (!userData && onAuthRequired) {
      onAuthRequired()
    } else {
      router.push(`/user/book?category=${catId}`)
    }
  }

  const scroll = (dir: "left" | "right") => {
    if (!sliderRef.current) return
    sliderRef.current.scrollBy({
      left: dir === "left" ? -350 : 350,
      behavior: "smooth",
    })
  }

  const handleScroll = () => {
    if (!sliderRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current
    const totalScroll = scrollWidth - clientWidth
    if (totalScroll > 0) {
      setScrollProgress((scrollLeft / totalScroll) * 100)
    }
  }

  return (
    <section className="relative w-full bg-[#09090b] text-white py-28 px-4 sm:px-6 lg:px-8 overflow-hidden border-t border-b border-white/10">
      {/* Background Ambient Glow & Light Radials */}
      <div className="absolute top-0 right-1/4 w-[32rem] h-[32rem] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div
        className="absolute bottom-10 left-10 w-[28rem] h-[28rem] bg-emerald-600/10 rounded-full blur-[130px] pointer-events-none animate-pulse-glow"
        style={{ animationDelay: '3s' }}
      />
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header - Centered */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto mb-14"
        >
          {/* Animated Fleet Tag with Glowing Beacon */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-[11px] font-black uppercase tracking-[0.25em] text-zinc-300 mb-4 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <span>Fleet</span>
          </div>

          {/* Kinetic Main Heading - Inline & Centered */}
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-white flex flex-wrap items-center justify-center gap-x-3.5">
            <span>Vehicles</span>
            <span className="relative inline-block bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Categories
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-1.5 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 rounded-full origin-center"
              />
            </span>
          </h2>

          {/* Subtitle - Centered */}
          <p className="text-zinc-400 text-base sm:text-lg mt-4 font-normal max-w-lg mx-auto">
            Choose the ride that fits your journey
          </p>

          {/* Controls: Filter Pills & Scroll Buttons - Centered */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              {[
                { id: 'all', label: 'All' },
                { id: 'two-wheeler', label: 'Bikes' },
                { id: 'four-wheeler', label: 'Cars & SUVs' },
                { id: 'cargo', label: 'Cargo Trucks' },
              ].map((tab) => {
                const isActive = activeFilter === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
                    className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive ? 'text-black shadow-md' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeFilterSlider"
                        className="absolute inset-0 bg-white rounded-xl"
                        transition={{ type: "spring", stiffness: 450, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Slider Arrow Buttons */}
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.88 }}
                whileHover={{ scale: 1.08 }}
                onClick={() => scroll("left")}
                className="w-11 h-11 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all text-white shadow-lg cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft size={18} strokeWidth={2.5} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.88 }}
                whileHover={{ scale: 1.08 }}
                onClick={() => scroll("right")}
                className="w-11 h-11 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all text-white shadow-lg cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight size={18} strokeWidth={2.5} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* 3D Tilt Cards Slider Track */}
        <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto scroll-smooth pb-8 pt-3 px-1 focus:outline-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {filteredCategories.map((c, i) => (
              <TiltCard
                key={c.id}
                category={c}
                index={i}
                isHovered={hovered === i}
                onHover={setHovered}
                onClick={() => handleCardClick(c.id)}
              />
            ))}
          </div>

          {/* Interactive Scroll Progress Indicator Bar */}
          <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden max-w-xs mx-auto">
            <motion.div
              suppressHydrationWarning
              className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full"
              style={{ width: `${Math.max(15, scrollProgress)}%` }}
            />
          </div>
        </div>

        {/* Upgraded 3 Bento Stat Cards with Live Animations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-16 pt-12 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Card 1: 6+ Categories */}
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative rounded-3xl p-7 bg-zinc-900/60 backdrop-blur-xl border border-white/10 overflow-hidden shadow-xl group"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-all" />
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Layers size={22} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400">
                Diverse Fleet
              </span>
            </div>

            <p className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-1">
              <AnimatedCounter target={6} suffix="+" />
            </p>
            <h4 className="text-lg font-bold text-zinc-200 mb-1">Categories</h4>
            <p className="text-xs text-zinc-400">
              Bikes, City Cars, Luxury SUVs, Family Vans & Heavy Freight.
            </p>
          </motion.div>

          {/* Card 2: 10+ Vehicle Types */}
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative rounded-3xl p-7 bg-zinc-900/60 backdrop-blur-xl border border-white/10 overflow-hidden shadow-xl group"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all" />
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <CarTaxiFront size={22} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400">
                Verified Body Types
              </span>
            </div>

            <p className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-1">
              <AnimatedCounter target={10} suffix="+" />
            </p>
            <h4 className="text-lg font-bold text-zinc-200 mb-1">Vehicle types</h4>
            <p className="text-xs text-zinc-400">
              Hatchbacks, Sedans, 7-Seaters, Mini-Trucks & Commercial Carriers.
            </p>
          </motion.div>

          {/* Card 3: 24/7 Availability */}
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative rounded-3xl p-7 bg-zinc-900/60 backdrop-blur-xl border border-white/10 overflow-hidden shadow-xl group"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/20 transition-all" />
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Clock size={22} />
              </div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live 24/7
              </span>
            </div>

            <p className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-1">
              24/7
            </p>
            <h4 className="text-lg font-bold text-zinc-200 mb-1">Availability</h4>
            <p className="text-xs text-zinc-400">
              Instant vehicle matching & dedicated roadside support anytime.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default VehicleSlider
