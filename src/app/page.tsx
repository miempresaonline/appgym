"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Dumbbell, ArrowRight } from "lucide-react";
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
      {/* Background glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-purple rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-brand-orange rounded-full mix-blend-screen filter blur-[120px] opacity-10"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md z-10 flex flex-col"
      >
        {/* Header / Logo */}
        <div className="flex flex-col items-center justify-center mb-12">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="w-16 h-16 bg-brand-surface rounded-2xl flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(143,0,255,0.2)] mb-6 relative"
          >
             <Dumbbell className="w-8 h-8 text-brand-purple" />
             <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-orange shadow-[0_0_10px_#FF6700]"></div>
          </motion.div>
          <h1 className="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
            APPGYM
          </h1>
          <p className="text-zinc-500 font-medium tracking-wide mt-2 text-xs uppercase">
            {isLogin ? "Welcome back, athlete" : "Start your journey"}
          </p>
        </div>

        {/* Login Form inside Glass Panel */}
        <div className="bg-[#121212]/80 backdrop-blur-2xl border border-white/5 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle inner top glow */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-purple/50 to-transparent opacity-50"></div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-widest">Email</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-brand-purple focus:border-brand-purple transition-all text-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-widest">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-brand-purple focus:border-brand-purple transition-all text-sm"
                  required
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-xs font-semibold text-brand-purple hover:text-[#c48bff] transition-colors">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative group overflow-hidden bg-brand-purple text-black font-extrabold text-sm tracking-widest uppercase py-4 rounded-full transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(143,0,255,0.3)] hover:shadow-[0_0_30px_rgba(143,0,255,0.5)] hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-brand-purple to-[#c48bff] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? "Processing..." : isLogin ? "Access Workout" : "Create Account"}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </span>
            </button>
          </form>

          <div className="mt-8 relative z-10">
            <button
              onClick={() => signIn('google')}
              className="w-full bg-[#1e1e1e] border border-white/5 text-white font-bold text-sm py-4 rounded-full hover:bg-[#2a2a2a] transition-all flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>
          </div>

          <div className="text-center mt-8 pt-6 border-t border-white/5 relative z-10">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[11px] font-bold tracking-widest text-zinc-500 hover:text-white transition-colors uppercase"
            >
              {isLogin ? "Need an account? Sign Up" : "Have an account? Log In"}
            </button>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
