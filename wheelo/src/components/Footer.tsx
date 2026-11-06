'use client'
import React from 'react'
import { motion } from "motion/react"
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'

function Footer() {
  return (
    <footer className="w-full bg-black text-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-6 py-14"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-black tracking-wider">WHEELO</h2>
            <p className="mt-2 text-gray-400 text-sm max-w-md">
              Book any vehicle — from bikes to trucks. Trusted owners. Transparent pricing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
              <motion.a
                key={i}
                whileHover={{ y: -3, scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 hover:bg-white hover:text-black transition"
              >
                <Icon size={18} />
              </motion.a>
            ))}
          </div>
        </div>

        <div className="pt-6 flex justify-between items-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} WHEELO. All rights reserved.</p>
        </div>
      </motion.div>
    </footer>
  )
}

export default Footer
