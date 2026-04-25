"use client";

import { motion } from "framer-motion";
import { Dumbbell } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 overflow-hidden relative">
      {/* Background gradients */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-brand-orange/10 via-purple-900/5 to-transparent opacity-60 blur-[100px] pointer-events-none" />
      
      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="z-10 w-full max-w-sm flex flex-col items-center mt-8"
      >
        <div className="bg-[#111] p-5 rounded-[2rem] mb-8 border border-white/5 shadow-2xl shadow-brand-orange/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/20 to-transparent opacity-20" />
          <Dumbbell size={40} className="text-brand-orange relative z-10" />
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-center text-white">
          APPGYM
        </h1>
        <p className="text-gray-400 text-center mb-10 text-sm font-medium">
          Cero fricción. Tu entrenador invisible.
        </p>

        {/* Login Form */}
        <div className="w-full space-y-4">
          <button className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-3.5 px-4 rounded-2xl hover:scale-[0.98] transition-transform shadow-lg">
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
              <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
              <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
              <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
            </svg>
            Entrar con Google
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-xs text-gray-500 uppercase font-medium">O usa tu email</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-3">
              <input 
                type="email" 
                placeholder="Tu correo electrónico" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#111] border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange/50 transition-all"
              />
              <input 
                type="password" 
                placeholder="Contraseña" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#111] border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange/50 transition-all"
              />
            </div>
            
            <button 
              type="submit"
              className="w-full bg-brand-orange text-white font-bold py-3.5 px-4 rounded-2xl hover:bg-orange-500 hover:scale-[0.98] transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)]"
            >
              Iniciar Sesión
            </button>
          </form>

          <p className="text-center text-gray-500 text-xs mt-6">
            ¿No tienes cuenta? <span className="text-brand-orange cursor-pointer hover:underline">Regístrate en segundos</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
