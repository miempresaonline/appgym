"use client";

import { motion } from "framer-motion";
import { Dumbbell, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 overflow-hidden relative">
      {/* Background gradients */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-brand-orange/20 to-transparent opacity-50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-violet-900/10 to-transparent opacity-50 blur-3xl pointer-events-none" />

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="z-10 w-full max-w-lg flex flex-col items-center mt-12"
      >
        <div className="bg-[#111] p-4 rounded-full mb-6 border border-white/5 shadow-lg shadow-brand-orange/10">
          <Dumbbell size={32} className="text-brand-orange" />
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Cero excusas.
          </span>
          <br />
          <span className="text-brand-orange">Cero fricción.</span>
        </h1>

        <p className="text-white/50 text-center mb-12 max-w-sm leading-relaxed">
          Tu entrenador invisible. Registra tu progreso al instante y vuelve a levantar pesado.
        </p>

        {/* Feature Cards (Glassmorphism) */}
        <div className="w-full grid gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center space-x-4"
          >
            <div className="bg-brand-orange/20 p-2 rounded-lg text-brand-orange">
              <Zap size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-white/90">Registro Ultra-Rápido</h3>
              <p className="text-xs text-white/50">Anota tus series en segundos</p>
            </div>
          </motion.div>
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full mt-auto mb-12"
        >
          <Link href="/auth" className="block w-full">
            <button className="w-full relative group overflow-hidden bg-brand-orange hover:bg-[#d94e09] transition-colors duration-300 text-white font-bold text-lg py-4 rounded-2xl flex items-center justify-center space-x-2 shadow-xl shadow-brand-orange/20">
              <span className="relative z-10">Comenzar Entrenamiento</span>
              <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              {/* Button shimmer effect */}
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            </button>
          </Link>
        </motion.div>
      </motion.div>

      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
