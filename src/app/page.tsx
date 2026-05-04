"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const isValidEmail = email.includes("@") && email.includes(".");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implement credentials sign in
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <main className="min-h-[100dvh] bg-black text-white font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop" 
          alt="Gym Background" 
          className="w-full h-full object-cover opacity-20 grayscale mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-[#050505]/95 to-black"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[360px] z-10 flex flex-col pt-8 pb-4 min-h-[100dvh] justify-center"
      >
        <div className="flex flex-col">
          {/* Header / Logo */}
          <div className="flex flex-col items-center justify-center mb-10">
            <motion.h1 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-[3.5rem] font-black italic tracking-tighter text-brand-purple mb-4 drop-shadow-[0_0_20px_rgba(143,0,255,0.6)]"
            >
              APPGYM
            </motion.h1>
            <div className="h-[40px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.h2 
                  key={isLogin ? 'login-title' : 'register-title'}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="text-base font-black text-center uppercase tracking-widest leading-snug max-w-[280px]"
                >
                  {isLogin ? "BIENVENIDO. ¿LISTO PARA ENTRENAR?" : "EMPIEZA TU VIAJE. ÚNETE AHORA."}
                </motion.h2>
              </AnimatePresence>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-5">
              {/* Email Input */}
              <motion.div 
                animate={{ scale: focusedField === 'email' ? 1.02 : 1 }}
                className="relative"
              >
                <label className="block text-[9px] font-bold text-zinc-500 mb-2 uppercase tracking-[0.2em] pl-4">
                  Correo Electrónico
                </label>
                <div className="relative">
                  {/* text-base is critical here to prevent iOS zoom bug */}
                  <input
                    type="email"
                    placeholder="atleta@appgym.com"
                    value={email}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#151515] rounded-[32px] px-6 h-[64px] text-white placeholder:text-zinc-600 focus:outline-none focus:bg-[#1f1f1f] transition-all text-base font-medium border border-transparent focus:border-brand-purple/50 focus:shadow-[0_0_20px_rgba(143,0,255,0.15)]"
                    required
                  />
                  {/* Dynamic checkmark for valid email */}
                  <AnimatePresence>
                    {isValidEmail && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-purple"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
              
              {/* Password Input */}
              <motion.div 
                animate={{ scale: focusedField === 'password' ? 1.02 : 1 }}
                className="relative"
              >
                <div className="flex justify-between items-center mb-2 px-4 h-[14px]">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                    Contraseña
                  </label>
                  <AnimatePresence>
                    {isLogin && (
                      <motion.button 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        type="button" 
                        className="text-[9px] font-bold text-brand-purple hover:text-[#c48bff] transition-colors uppercase tracking-[0.1em]"
                      >
                        ¿Olvidaste tu contraseña?
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#151515] rounded-[32px] pl-6 pr-14 h-[64px] text-white placeholder:text-zinc-600 focus:outline-none focus:bg-[#1f1f1f] transition-all text-base font-medium border border-transparent focus:border-brand-purple/50 focus:shadow-[0_0_20px_rgba(143,0,255,0.15)] tracking-widest"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-purple text-black font-extrabold text-[13px] tracking-[0.2em] uppercase h-[64px] rounded-[32px] transition-all disabled:opacity-70 shadow-[0_0_25px_rgba(143,0,255,0.3)] mt-6 flex items-center justify-center gap-3 overflow-hidden relative"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                />
              ) : (
                <AnimatePresence mode="wait">
                  <motion.span
                    key={isLogin ? 'btn-login' : 'btn-register'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isLogin ? "INICIAR SESIÓN" : "REGISTRARSE"}
                  </motion.span>
                </AnimatePresence>
              )}
            </motion.button>
          </form>

          {/* Social Auth */}
          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-x-0 h-px bg-white/5"></div>
              <span className="relative bg-transparent px-4 text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">
                O continúa con
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => signIn('google')}
              className="w-full bg-[#111111] border border-white/5 text-white font-bold text-[11px] h-[64px] rounded-[32px] hover:bg-[#1a1a1a] transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff"/>
              </svg>
              INICIAR CON GOOGLE
            </motion.button>
          </div>
        </div>

        {/* Footer Toggle */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 mb-4"
        >
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[10px] font-medium text-zinc-500 hover:text-white transition-colors tracking-widest relative group overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'footer-login' : 'footer-register'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {isLogin ? (
                  <>¿No tienes cuenta? <span className="text-brand-purple font-bold">ÚNETE</span></>
                ) : (
                  <>¿Ya eres atleta? <span className="text-brand-purple font-bold">INICIAR SESIÓN</span></>
                )}
              </motion.div>
            </AnimatePresence>
          </button>
        </motion.div>
      </motion.div>
    </main>
  );
}
