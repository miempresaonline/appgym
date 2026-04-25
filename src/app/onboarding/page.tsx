"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

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
    // TODO: Save to database using a server action or API route
    console.log("Onboarding finished:", { name, age, goal });
    window.location.href = "/dashboard";
  };

  const containerVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 text-white relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-brand-orange/10 via-purple-900/5 to-transparent opacity-60 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-sm z-10">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
              <h1 className="text-3xl font-extrabold tracking-tight">Hola, soy tu Entrenador Invisible.</h1>
              <p className="text-gray-400 text-lg">Para ajustar mis algoritmos a tu cuerpo, ¿cómo te llamo?</p>
              <input 
                type="text" 
                autoFocus
                placeholder="Tu nombre o apodo" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && name && nextStep()}
                className="w-full bg-[#111] border border-white/10 rounded-2xl px-5 py-4 text-xl font-medium text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all"
              />
              <button 
                onClick={nextStep}
                disabled={!name}
                className="w-full flex items-center justify-center gap-2 bg-brand-orange text-white font-bold py-4 px-4 rounded-2xl hover:bg-orange-500 hover:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 disabled:hover:bg-brand-orange"
              >
                Continuar <ChevronRight size={20} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
              <h1 className="text-3xl font-extrabold tracking-tight">Encantado, {name}.</h1>
              <p className="text-gray-400 text-lg">¿Cuántos años tienes? Lo necesito para medir tu recuperación.</p>
              <input 
                type="number" 
                autoFocus
                placeholder="Tu edad" 
                value={age}
                onChange={(e) => setAge(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && age && nextStep()}
                className="w-full bg-[#111] border border-white/10 rounded-2xl px-5 py-4 text-xl font-medium text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all"
              />
              <button 
                onClick={nextStep}
                disabled={!age}
                className="w-full flex items-center justify-center gap-2 bg-brand-orange text-white font-bold py-4 px-4 rounded-2xl hover:bg-orange-500 hover:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
              >
                Continuar <ChevronRight size={20} />
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
              <h1 className="text-3xl font-extrabold tracking-tight">Última pregunta.</h1>
              <p className="text-gray-400 text-lg">¿A qué has venido al gimnasio? ¿Cuál es tu meta real?</p>
              
              <div className="space-y-3">
                {['Ganar fuerza bruta', 'Ganar masa muscular', 'Perder grasa y definir', 'Mantenerme sano'].map((g) => (
                  <button
                    key={g}
                    onClick={() => { setGoal(g); finishOnboarding(); }}
                    className="w-full text-left bg-[#111] border border-white/10 hover:border-brand-orange/50 rounded-2xl px-5 py-4 text-lg font-medium text-gray-200 hover:text-white transition-all flex items-center justify-between group"
                  >
                    {g}
                    <ChevronRight size={20} className="opacity-0 group-hover:opacity-100 text-brand-orange transition-opacity" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="mt-12 flex justify-center gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-300 ${step >= i ? 'w-8 bg-brand-orange' : 'w-2 bg-white/10'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
