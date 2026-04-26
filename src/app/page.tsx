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
                className="w-full relative flex items-center justify-center gap-4 bg-white/90 backdrop-blur-md text-black font-bold py-4 px-6 rounded-2xl shadow-[0_10px_20px_-10px_rgba(0,0,0,0.2)] transition-all duration-300"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                  <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                  <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                  <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                  <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
                </svg>
                Continuar con Google
              </motion.button>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink-0 mx-4 text-xs text-white/40 uppercase tracking-[0.2em] font-medium">O usa tu email</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-4">
                  {/* Neumorphic/Glass Inputs */}
                  <input 
                    type="email" 
                    placeholder="tucorreo@ejemplo.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/30 text-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-black/30 transition-all shadow-inner"
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
