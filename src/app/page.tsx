"use client";

import { motion } from "framer-motion";
import { Dumbbell, ArrowRight } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen w-full bg-[#030014] selection:bg-purple-500/30 overflow-hidden relative flex items-center justify-center font-sans text-white">
      
      {/* Liquid Glass Dynamic Background (Animated Orbs) */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] md:w-[50vw] md:h-[50vw] rounded-full bg-purple-700/40 blur-[100px] md:blur-[180px] mix-blend-screen pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-20%] right-[-10%] w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] rounded-full bg-orange-600/30 blur-[100px] md:blur-[180px] mix-blend-screen pointer-events-none" 
      />
      <motion.div 
        animate={{ y: [0, -50, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] right-[20%] w-[40vw] h-[40vw] rounded-full bg-pink-600/20 blur-[120px] mix-blend-screen pointer-events-none" 
      />
      
      {/* Subtle Noise Texture for realism */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto px-6 py-12 md:py-20 flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24 z-10 relative">
        
        {/* Left Column: Spatial UI Branding */}
        <motion.div 
          initial={{ opacity: 0, x: -40, filter: "blur(10px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left"
        >
          {/* Floating Glass Icon */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative flex items-center justify-center w-24 h-24 mb-10 rounded-[2rem] bg-white/[0.05] border border-white/20 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.4)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
            <Dumbbell className="w-12 h-12 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/20 leading-[1.1] drop-shadow-lg">
            Gravedad <br className="hidden lg:block"/> Cero.
          </h1>
          <p className="text-white/60 text-xl font-light tracking-wide max-w-lg mb-12 leading-relaxed">
            Tu entrenador adaptativo. Experimenta la interfaz de fitness más avanzada, potenciada por IA generativa.
          </p>
          
          <div className="hidden lg:flex flex-wrap gap-4">
            <span className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm font-medium text-white/80 shadow-lg">🧠 Generative AI</span>
            <span className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm font-medium text-white/80 shadow-lg">⚡ Spatial UI</span>
          </div>
        </motion.div>

        {/* Right Column: Liquid Glass Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="w-full lg:max-w-[480px] flex-shrink-0 perspective-[1000px]"
        >
          {/* The Glass Container */}
          <motion.div 
            whileHover={{ rotateX: 2, rotateY: -2 }}
            className="w-full bg-white/[0.08] backdrop-blur-2xl border border-white/20 p-8 md:p-12 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.3)] relative overflow-hidden"
          >
            {/* Liquid Highlight */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[45deg] animate-[shine_8s_ease-in-out_infinite]" />

            <h2 className="text-3xl font-bold text-white mb-8 text-center tracking-tight drop-shadow-md">Entrar a la cápsula</h2>
            
            <div className="space-y-6 relative z-10">
              {/* Floating Google Button */}
              <motion.button 
                whileHover={{ scale: 1.03, y: -4, boxShadow: "0 20px 40px -10px rgba(255,255,255,0.3)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => signIn('google')}
                className="w-full flex items-center justify-center gap-3 bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-4 px-6 rounded-[1.25rem] shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.1)] transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:animate-[shine_2s_ease-in-out_infinite]" />
                <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="relative z-10 tracking-wide text-lg">Continuar con Google</span>
              </motion.button>

              <div className="flex items-center gap-4 w-full">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/20" />
                <span className="text-white/40 text-xs font-semibold tracking-widest uppercase">O usa tu email</span>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/20" />
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <input 
                    type="email" 
                    placeholder="tucorreo@ejemplo.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-[1.25rem] px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-black/30 transition-all shadow-inner backdrop-blur-md"
                  />
                  <input 
                    type="password" 
                    placeholder="Contraseña" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/30 text-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-black/30 transition-all shadow-inner"
                  />
                </div>
                
                {/* Ethereal Glow Button */}
                <motion.button 
                  whileHover={{ scale: 1.03, y: -4, boxShadow: "0 20px 40px -10px rgba(139,92,246,0.6)" }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full relative overflow-hidden bg-gradient-to-r from-purple-500 to-orange-500 text-white font-bold py-5 px-6 rounded-2xl shadow-[0_10px_20px_-10px_rgba(139,92,246,0.4)] transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity" />
                  <span className="relative z-10 flex items-center justify-center gap-3 text-lg tracking-wider">
                    INICIAR SESIÓN
                    <ArrowRight size={20} className="drop-shadow-md" />
                  </span>
                </motion.button>
              </form>

              <p className="text-center text-white/50 text-sm mt-8 font-medium">
                ¿Aún no tienes cuenta? <span className="text-white hover:text-orange-400 cursor-pointer transition-colors drop-shadow-md">Únete ahora</span>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes shine {
          0% { left: -100%; }
          20% { left: 200%; }
          100% { left: 200%; }
        }
      `}</style>
    </div>
  );
}
