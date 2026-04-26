"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowRight } from "lucide-react";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [goal, setGoal] = useState("");

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else finishOnboarding();
  };

  const finishOnboarding = () => {
    console.log("Onboarding finished:", { name, age, goal });
    window.location.href = "/dashboard";
  };

  const containerVariants: any = {
    hidden: { opacity: 0, x: 40, filter: "blur(10px)" },
    visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, x: -40, filter: "blur(10px)", transition: { duration: 0.3 } }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 overflow-hidden relative bg-[#050505] selection:bg-purple-500/30">
      
      {/* Premium Ambient Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-900/20 blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-orange-900/10 blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50 pointer-events-none" />

      <div className="w-full max-w-[420px] z-10 relative">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-10 bg-white/[0.02] backdrop-blur-3xl border border-white/[0.05] p-10 md:p-14 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
              
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50 leading-tight">Hola, soy tu <br/> Entrenador.</h1>
                <p className="text-white/50 text-lg md:text-xl font-medium">Para ajustar mis algoritmos a tu cuerpo, ¿cómo te llamo?</p>
              </div>

              <input 
                type="text" 
                autoFocus
                placeholder="Tu nombre o apodo" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && name && nextStep()}
                className="w-full bg-[#111111]/80 border border-white/[0.08] rounded-2xl px-6 py-5 text-2xl font-semibold text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-[#1a1a1a] transition-all"
              />
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={nextStep}
                disabled={!name}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-700 via-purple-600 to-orange-500 text-white font-bold py-5 px-6 rounded-2xl shadow-[0_10px_30px_-10px_rgba(139,92,246,0.5)] hover:shadow-[0_15px_40px_-10px_rgba(139,92,246,0.7)] transition-all duration-300 disabled:opacity-50 disabled:shadow-none disabled:hover:scale-100 group"
                style={{ backgroundSize: '200% auto', animation: 'gradient 4s linear infinite' }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2 text-lg tracking-wide">
                  CONTINUAR
                  <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-10 bg-white/[0.02] backdrop-blur-3xl border border-white/[0.05] p-10 md:p-14 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50 leading-tight">Encantado, <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-orange-400">{name}</span>.</h1>
                <p className="text-white/50 text-lg md:text-xl font-medium">¿Cuántos años tienes? Lo necesito para medir tu recuperación.</p>
              </div>

              <input 
                type="number" 
                autoFocus
                placeholder="Tu edad" 
                value={age}
                onChange={(e) => setAge(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && age && nextStep()}
                className="w-full bg-[#111111]/80 border border-white/[0.08] rounded-2xl px-6 py-5 text-2xl font-semibold text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-[#1a1a1a] transition-all"
              />
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={nextStep}
                disabled={!age}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-700 via-purple-600 to-orange-500 text-white font-bold py-5 px-6 rounded-2xl shadow-[0_10px_30px_-10px_rgba(139,92,246,0.5)] hover:shadow-[0_15px_40px_-10px_rgba(139,92,246,0.7)] transition-all duration-300 disabled:opacity-50 disabled:shadow-none disabled:hover:scale-100 group"
                style={{ backgroundSize: '200% auto', animation: 'gradient 4s linear infinite' }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2 text-lg tracking-wide">
                  CONTINUAR
                  <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-10 bg-white/[0.02] backdrop-blur-3xl border border-white/[0.05] p-10 md:p-14 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50 leading-tight">Última pregunta.</h1>
                <p className="text-white/50 text-lg md:text-xl font-medium">¿A qué has venido al gimnasio? ¿Cuál es tu meta real?</p>
              </div>
              
              <div className="space-y-4">
                {['Ganar fuerza bruta', 'Ganar masa muscular', 'Perder grasa y definir', 'Mantenerme sano'].map((g) => (
                  <motion.button
                    key={g}
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.06)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setGoal(g); finishOnboarding(); }}
                    className="w-full text-left bg-[#111111]/80 border border-white/[0.06] hover:border-purple-500/50 rounded-2xl px-6 py-5 text-xl font-medium text-white/80 hover:text-white transition-all flex items-center justify-between group shadow-sm"
                  >
                    {g}
                    <ChevronRight size={24} className="text-white/20 group-hover:text-orange-400 transition-colors" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimal Progress Bar */}
        <div className="absolute -bottom-20 inset-x-0 flex justify-center gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-2 rounded-full transition-all duration-500 ease-out ${step >= i ? 'w-12 bg-gradient-to-r from-purple-500 to-orange-400 shadow-[0_0_15px_rgba(139,92,246,0.6)]' : 'w-4 bg-white/10'}`} />
          ))}
        </div>
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
