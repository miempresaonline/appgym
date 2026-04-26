"use client";

import { motion } from "framer-motion";
import { Dumbbell, ArrowRight } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen w-full bg-[#050505] selection:bg-purple-500/30 overflow-hidden relative flex items-center justify-center">
      
      {/* Global Ambient Backgrounds */}
      <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-900/30 blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-15%] right-[-5%] w-[600px] h-[600px] rounded-full bg-orange-900/20 blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50 pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto px-6 py-12 md:py-20 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24 z-10">
        
        {/* Left Column: Branding (Desktop focused) */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left pt-10 lg:pt-0"
        >
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 mb-8 rounded-[1.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-3xl shadow-[0_0_50px_rgba(139,92,246,0.2)] overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/30 to-orange-500/30 opacity-0 group-hover:opacity-100 transition-all duration-700" />
            <Dumbbell className="w-10 h-10 md:w-12 md:h-12 text-white relative z-10 group-hover:text-purple-300 transition-colors duration-500" />
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/30 leading-tight">
            Entrena <br className="hidden lg:block"/> sin excusas.
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-medium tracking-wide max-w-lg mb-10 leading-relaxed">
            Tu entrenador invisible potenciado por Inteligencia Artificial. Registra tu progreso, adapta tu volumen y rompe tus límites.
          </p>
          
          <div className="hidden lg:flex items-center gap-4 text-sm font-semibold text-white/50 uppercase tracking-widest">
            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"/> AI Engine</span>
            <span>•</span>
            <span>RPE Auto-Tracking</span>
          </div>
        </motion.div>

        {/* Right Column: Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:max-w-[440px] flex-shrink-0"
        >
          <div className="w-full bg-[#0a0a0a]/60 backdrop-blur-[40px] border border-white/[0.08] p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_80px_-20px_rgba(139,92,246,0.3)] relative overflow-hidden group/card">
            {/* Inner dynamic glow */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-50 group-hover/card:opacity-100 transition-opacity duration-700" />
            <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/[0.02] to-transparent rotate-45 translate-x-[-100%] group-hover/card:translate-x-[100%] transition-transform duration-[1.5s] ease-in-out pointer-events-none" />

            <h2 className="text-2xl font-bold text-white mb-8 text-center tracking-tight">Acceso Rápido</h2>
            
            <div className="space-y-6">
              {/* Google Button */}
              <motion.button 
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => signIn('google')}
                className="w-full relative flex items-center justify-center gap-3 bg-white text-black font-bold py-4 px-4 rounded-2xl transition-all shadow-[0_10px_30px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_15px_40px_-10px_rgba(255,255,255,0.5)] group"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                  <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                  <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                  <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
                </svg>
                Continuar con Google
              </motion.button>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-white/[0.05]"></div>
                <span className="flex-shrink-0 mx-4 text-[10px] text-white/30 uppercase tracking-widest font-bold">O usa tu email</span>
                <div className="flex-grow border-t border-white/[0.05]"></div>
              </div>

              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-4">
                  <div className="relative">
                    <input 
                      type="email" 
                      placeholder="tucorreo@ejemplo.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#111111]/80 border border-white/[0.06] rounded-2xl px-5 py-4 text-white placeholder:text-white/20 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/70 focus:border-purple-500/50 focus:bg-[#1a1a1a] transition-all"
                    />
                  </div>
                  <div className="relative">
                    <input 
                      type="password" 
                      placeholder="Contraseña" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#111111]/80 border border-white/[0.06] rounded-2xl px-5 py-4 text-white placeholder:text-white/20 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/70 focus:border-purple-500/50 focus:bg-[#1a1a1a] transition-all"
                    />
                  </div>
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full relative overflow-hidden bg-gradient-to-r from-purple-700 via-purple-600 to-orange-500 text-white font-bold py-4 px-4 rounded-2xl shadow-[0_10px_30px_-10px_rgba(139,92,246,0.6)] hover:shadow-[0_15px_40px_-10px_rgba(139,92,246,0.8)] transition-all duration-300 group"
                  style={{ backgroundSize: '200% auto', animation: 'gradient 4s linear infinite' }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 tracking-wide">
                    INICIAR SESIÓN
                    <ArrowRight size={18} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </span>
                </motion.button>
              </form>

              <p className="text-center text-white/40 text-xs mt-6 font-medium">
                ¿Aún no tienes cuenta? <span className="text-orange-400 cursor-pointer hover:text-orange-300 hover:underline transition-colors">Únete ahora</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
