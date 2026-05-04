"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implement credentials sign in
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <main className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop" 
          alt="Gym Background" 
          className="w-full h-full object-cover opacity-30 grayscale mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm z-10 flex flex-col pt-12 pb-6 min-h-screen justify-between"
      >
        <div className="flex flex-col flex-grow justify-center">
          {/* Header / Logo */}
          <div className="flex flex-col items-center justify-center mb-10">
            <h1 className="text-6xl font-black italic tracking-tighter text-brand-purple mb-6 drop-shadow-[0_0_15px_rgba(143,0,255,0.4)]">
              APPGYM
            </h1>
            <h2 className="text-xl font-black text-center uppercase tracking-wide leading-tight max-w-[280px]">
              {isLogin ? "Welcome back. Ready to train?" : "Start your journey. Join the vault."}
            </h2>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-2 uppercase tracking-widest pl-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="athlete@appgym.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1A1A1A] rounded-full px-6 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand-purple transition-all text-sm font-medium"
                  required
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2 px-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    Password
                  </label>
                  {isLogin && (
                    <button type="button" className="text-[10px] font-bold text-brand-purple hover:text-white transition-colors uppercase tracking-widest">
                      Forgot Password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1A1A1A] rounded-full px-6 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand-purple transition-all text-sm font-medium"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-purple text-black font-extrabold text-sm tracking-widest uppercase py-4 rounded-full transition-all disabled:opacity-70 hover:scale-[1.02] shadow-[0_0_20px_rgba(143,0,255,0.2)] mt-4"
            >
              {isLoading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>

          {/* Social Auth */}
          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-x-0 h-px bg-zinc-800"></div>
              <span className="relative bg-black px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Or continue with
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => signIn('google')}
                className="flex-1 bg-[#1A1A1A] text-white font-bold text-xs py-4 rounded-full hover:bg-[#252525] transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff"/>
                </svg>
                Google
              </button>
              
              <button
                className="flex-1 bg-[#1A1A1A] text-white font-bold text-xs py-4 rounded-full hover:bg-[#252525] transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.365 21.411c-1.396 2.015-2.835 4.02-5.074 4.048-2.203.028-2.92-1.32-5.45-1.32-2.528 0-3.324 1.291-5.45 1.348-2.182.057-3.83-2.184-5.234-4.215-2.846-4.129-5.02-11.66-2.112-16.711 1.442-2.502 3.998-4.096 6.812-4.124 2.126-.028 4.14 1.442 5.45 1.442 1.309 0 3.738-1.748 6.287-1.493 2.653.257 5.08 1.32 6.64 3.584-5.597 3.458-4.664 11.536 1.054 13.911-1.285 3.208-2.613 5.456-4.208 7.641zM11.968 7.391c-.342-3.111 2.37-6.02 5.417-6.391.436 3.327-2.736 6.182-5.417 6.391z"/>
                </svg>
                Apple
              </button>
            </div>
          </div>
        </div>

        {/* Footer Toggle */}
        <div className="text-center mt-6">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[11px] font-medium text-zinc-500 hover:text-white transition-colors"
          >
            {isLogin ? (
              <>Don't have an account? <span className="text-brand-purple font-bold">JOIN THE VAULT</span></>
            ) : (
              <>Already an athlete? <span className="text-brand-purple font-bold">SIGN IN</span></>
            )}
          </button>
        </div>
      </motion.div>
    </main>
  );
}
