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
    hidden: { opacity: 0, x: 40, filter: "blur(10px)", scale: 0.95 },
    visible: { opacity: 1, x: 0, filter: "blur(0px)", scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, x: -40, filter: "blur(10px)", scale: 0.95, transition: { duration: 0.4 } }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 overflow-hidden relative bg-[#030014] selection:bg-purple-500/30 text-white font-sans">
      
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
      
      {/* Subtle Noise Texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />

      <div className="w-full max-w-[500px] z-10 relative perspective-[1000px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1" 
              variants={containerVariants} 
              initial="hidden" 
              animate="visible" 
              exit="exit" 
              whileHover={{ rotateX: 2, rotateY: -2 }}
              className="space-y-10 bg-white/[0.08] backdrop-blur-2xl border border-white/20 p-10 md:p-14 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.3)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[45deg] animate-[shine_8s_ease-in-out_infinite]" />
              
              <div className="space-y-4 relative z-10">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50 leading-[1.1] drop-shadow-lg">Hola, soy tu <br/> Entrenador.</h1>
                <p className="text-white/60 text-lg md:text-xl font-medium">Para ajustar mis algoritmos a tu cuerpo, ¿cómo te llamo?</p>
              </div>

              <div className="relative z-10">
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Tu nombre o apodo" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && name && nextStep()}
                  className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-5 text-2xl font-semibold text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-black/30 transition-all shadow-inner"
                />
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.03, y: -4, boxShadow: "0 20px 40px -10px rgba(139,92,246,0.6)" }}
                whileTap={{ scale: 0.98 }}
                onClick={nextStep}
                disabled={!name}
                className="w-full relative overflow-hidden flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 to-orange-500 text-white font-bold py-5 px-6 rounded-2xl shadow-[0_10px_20px_-10px_rgba(139,92,246,0.4)] transition-all duration-300 disabled:opacity-50 disabled:shadow-none disabled:hover:scale-100 disabled:hover:translate-y-0 z-10"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center justify-center gap-2 text-lg tracking-wide drop-shadow-md">
                  CONTINUAR
                  <ArrowRight size={22} />
                </span>
              </motion.button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2" 
              variants={containerVariants} 
              initial="hidden" 
              animate="visible" 
              exit="exit" 
              whileHover={{ rotateX: 2, rotateY: -2 }}
              className="space-y-10 bg-white/[0.08] backdrop-blur-2xl border border-white/20 p-10 md:p-14 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.3)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[45deg] animate-[shine_8s_ease-in-out_infinite]" />

              <div className="space-y-4 relative z-10">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50 leading-[1.1] drop-shadow-lg">Encantado, <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-orange-400">{name}</span>.</h1>
                <p className="text-white/60 text-lg md:text-xl font-medium">¿Cuántos años tienes? Lo necesito para medir tu recuperación.</p>
              </div>

              <div className="relative z-10">
                <input 
                  type="number" 
                  autoFocus
                  placeholder="Tu edad" 
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && age && nextStep()}
                  className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-5 text-2xl font-semibold text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-black/30 transition-all shadow-inner"
                />
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.03, y: -4, boxShadow: "0 20px 40px -10px rgba(139,92,246,0.6)" }}
                whileTap={{ scale: 0.98 }}
                onClick={nextStep}
                disabled={!age}
                className="w-full relative overflow-hidden flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 to-orange-500 text-white font-bold py-5 px-6 rounded-2xl shadow-[0_10px_20px_-10px_rgba(139,92,246,0.4)] transition-all duration-300 disabled:opacity-50 disabled:shadow-none disabled:hover:scale-100 disabled:hover:translate-y-0 z-10"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center justify-center gap-2 text-lg tracking-wide drop-shadow-md">
                  CONTINUAR
                  <ArrowRight size={22} />
                </span>
              </motion.button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3" 
              variants={containerVariants} 
              initial="hidden" 
              animate="visible" 
              exit="exit" 
              whileHover={{ rotateX: 2, rotateY: -2 }}
              className="space-y-10 bg-white/[0.08] backdrop-blur-2xl border border-white/20 p-10 md:p-14 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.3)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[45deg] animate-[shine_8s_ease-in-out_infinite]" />

              <div className="space-y-4 relative z-10">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50 leading-[1.1] drop-shadow-lg">Última pregunta.</h1>
                <p className="text-white/60 text-lg md:text-xl font-medium">¿A qué has venido al gimnasio? ¿Cuál es tu meta real?</p>
              </div>
              
              <div className="space-y-4 relative z-10">
                {['Ganar fuerza bruta', 'Ganar masa muscular', 'Perder grasa y definir', 'Mantenerme sano'].map((g) => (
                  <motion.button
                    key={g}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setGoal(g); finishOnboarding(); }}
                    className="w-full text-left bg-black/20 border border-white/10 hover:border-white/30 hover:bg-black/30 rounded-2xl px-6 py-5 text-xl font-medium text-white/80 hover:text-white transition-all flex items-center justify-between group shadow-sm"
                  >
                    {g}
                    <ChevronRight size={24} className="text-white/30 group-hover:text-white transition-colors" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Minimal Progress Bar */}
        <div className="absolute -bottom-24 inset-x-0 flex justify-center gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-2 rounded-full transition-all duration-700 ease-out ${step >= i ? 'w-12 bg-white shadow-[0_0_15px_rgba(255,255,255,0.6)]' : 'w-4 bg-white/20'}`} />
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
