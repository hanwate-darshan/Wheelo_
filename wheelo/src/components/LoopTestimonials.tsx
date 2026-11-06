'use client'
import React from 'react'
import { motion } from 'motion/react'
import { Star, Quote, CheckCircle } from 'lucide-react'

const TESTIMONIALS_ROW_1 = [
  {
    name: "Aarav Sharma",
    role: "Daily Commuter, Mumbai",
    vehicle: "Bike Ride",
    text: "Booked a bike ride during peak Western Express highway traffic. The rider arrived in under 3 minutes! Saved me an entire hour.",
    rating: 5,
    avatar: "AS"
  },
  {
    name: "Pooja Hegde",
    role: "Family Vacationer, Pune",
    vehicle: "7-Seater SUV",
    text: "Rented an Innova for a weekend Mahabaleshwar trip with my family. The vehicle was spotlessly clean, smooth drive, zero issues.",
    rating: 5,
    avatar: "PH"
  },
  {
    name: "Rohan Deshmukh",
    role: "Warehouse Manager, Thane",
    vehicle: "Tata 407 Cargo",
    text: "Transporting 2 tons of factory goods was effortless. Live GPS tracking meant I always knew where my cargo was. Transparent pricing without bargaining!",
    rating: 5,
    avatar: "RD"
  },
  {
    name: "Meera Nair",
    role: "Corporate Executive, Bengaluru",
    vehicle: "Premium Sedan",
    text: "WHEELO is by far the cleanest and most reliable mobility platform. The upfront fare lock means no surprise charges at the end.",
    rating: 5,
    avatar: "MN"
  }
]

const TESTIMONIALS_ROW_2 = [
  {
    name: "Siddharth Verma",
    role: "Freelancer, Delhi NCR",
    vehicle: "Electric Scooter",
    text: "Super smooth booking flow. The UI is lightning fast and customer support answers in seconds if you ever need them.",
    rating: 5,
    avatar: "SV"
  },
  {
    name: "Kavita Patil",
    role: "Event Organizer, Navi Mumbai",
    vehicle: "14-Seater Tempo Traveler",
    text: "Booked multiple vans for our wedding guests. All vehicles arrived ahead of time and the drivers were extremely courteous.",
    rating: 5,
    avatar: "KP"
  },
  {
    name: "Vikram Malhotra",
    role: "Small Business Owner, Surat",
    vehicle: "Pickup Truck",
    text: "Commercial transport used to be a headache with offline brokers. WHEELO makes it as easy as ordering food online.",
    rating: 5,
    avatar: "VM"
  },
  {
    name: "Ananya Iyer",
    role: "University Student, Pune",
    vehicle: "Economy Car",
    text: "Affordable student rates, zero security deposit hassles, and quick verification. Highly recommended to everyone!",
    rating: 5,
    avatar: "AI"
  }
]

function TestimonialCard({ t }: { t: typeof TESTIMONIALS_ROW_1[0] }) {
  return (
    <div className="w-[320px] sm:w-[380px] rounded-2xl p-6 bg-white border border-zinc-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-300 flex-shrink-0 flex flex-col justify-between group hover:-translate-y-1">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 text-amber-400">
            {[...Array(t.rating)].map((_, i) => (
              <Star key={i} size={15} fill="currentColor" />
            ))}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600">
            {t.vehicle}
          </span>
        </div>

        <p className="text-zinc-700 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
          &ldquo;{t.text}&rdquo;
        </p>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-zinc-100">
        <div className="w-10 h-10 rounded-full bg-zinc-900 text-white font-bold text-xs flex items-center justify-center shadow-md">
          {t.avatar}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h4 className="font-bold text-xs sm:text-sm text-zinc-900">{t.name}</h4>
            <CheckCircle size={13} className="text-blue-500" />
          </div>
          <p className="text-[11px] text-zinc-400 font-medium">{t.role}</p>
        </div>
      </div>
    </div>
  )
}

export default function LoopTestimonials() {
  return (
    <section className="relative w-full bg-white py-24 overflow-hidden border-t border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 mb-14 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="h-0.5 w-6 bg-zinc-900" />
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Verified Feedback</span>
          <span className="h-0.5 w-6 bg-zinc-900" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900">
          Loved by Thousands of Commuters & Businesses
        </h2>
        <p className="text-zinc-500 text-sm mt-3 max-w-lg mx-auto">
          Read what genuine daily riders, fleet operators, and logistics partners have to say about WHEELO.
        </p>
      </div>

      {/* Infinite Marquee Track 1 (Leftward) */}
      <div className="relative w-full overflow-hidden mb-6">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex items-center gap-6">
          {[...TESTIMONIALS_ROW_1, ...TESTIMONIALS_ROW_1].map((item, idx) => (
            <TestimonialCard key={idx} t={item} />
          ))}
        </div>
      </div>

      {/* Infinite Marquee Track 2 (Rightward) */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee-reverse flex items-center gap-6">
          {[...TESTIMONIALS_ROW_2, ...TESTIMONIALS_ROW_2].map((item, idx) => (
            <TestimonialCard key={idx} t={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
