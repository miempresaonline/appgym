"use client";

import { motion } from "framer-motion";
import { Dumbbell } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 overflow-hidden relative bg-[#050505] selection:bg-purple-500/30">
      
      {/* Premium Ambient Background (Deep Purple & Subtle Orange) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-900/30 blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-orange-900/20 blur-[120px] pointer-events-none mix-blend-screen" />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50 pointer-events-none" />

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="z-10 w-full max-w-[400px] flex flex-col items-center"
      >
        {/* Logo Glass Icon */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="relative flex items-center justify-center w-20 h-20 mb-8 rounded-[1.5rem] bg-gradient-to-b from-white/10 to-white/5 border border-white/10 backdrop-blur-2xl shadow-[0_0_40px_rgba(139,92,246,0.15)] overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Dumbbell size={36} className="text-white relative z-10" />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-3 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 text-center">
          APPGYM
        </h1>
        <p className="text-gray-400/80 text-center mb-10 text-base md:text-lg font-medium tracking-wide">
          Tu entrenador invisible.
        </p>

        {/* Glassmorphic Form Card */}
        <div className="w-full bg-white/[0.03] backdrop-blur-3xl border border-white/[0.08] p-6 md:p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
          
          <div className="space-y-5">
            {/* Google Button */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => signIn('google')}
              className="w-full relative flex items-center justify-center gap-3 bg-white text-black font-semibold py-4 px-4 rounded-2xl transition-all shadow-[0_4px_14px_0_rgba(255,255,255,0.1)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.15)] group"
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
              <div className="flex-grow border-t border-white/[0.06]"></div>
              <span className="flex-shrink-0 mx-4 text-[11px] text-white/30 uppercase tracking-widest font-semibold">O ingresa con tu email</span>
              <div className="flex-grow border-t border-white/[0.06]"></div>
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-3">
                <div className="relative group">
                  <input 
                    type="email" 
                    placeholder="tucorreo@ejemplo.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl px-5 py-4 text-white placeholder:text-white/20 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-white/[0.06] transition-all"
                  />
                </div>
                <div className="relative group">
                  <input 
                    type="password" 
                    placeholder="Contraseña" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl px-5 py-4 text-white placeholder:text-white/20 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-white/[0.06] transition-all"
                  />
                </div>
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full relative overflow-hidden bg-purple-600 text-white font-semibold py-4 px-4 rounded-2xl shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all duration-300 group"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 via-orange-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" style={{ backgroundSize: '200% auto', animation: 'gradient 3s linear infinite' }} />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Iniciar Sesión
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </span>
              </motion.button>
            </form>

            <p className="text-center text-white/40 text-xs mt-6 font-medium">
              ¿Primera vez? <span className="text-orange-400 cursor-pointer hover:text-orange-300 hover:underline transition-colors">Crea tu cuenta en 10s</span>
            </p>
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
    </div>
  );
}
