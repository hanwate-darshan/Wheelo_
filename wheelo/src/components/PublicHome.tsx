'use client'
import React, { useState } from 'react'
import HeroSection from './HeroSection'
import VehicleSlider from './VehicleSlider'
import AuthModal from './AuthModal'

function PublicHome() {
  const [authOpen, setAuthOpen] = useState(false)

  return (
    <main className="w-full bg-[#09090b] min-h-screen">
      <HeroSection onAuthRequired={() => setAuthOpen(true)} />
      <VehicleSlider onAuthRequired={() => setAuthOpen(true)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </main>
  )
}

export default PublicHome
