"use client";
import { useState, useEffect, useRef } from "react";
import { X, Plus, Clock, Bot, ChevronRight, Play, CheckCircle2, ChevronDown, Check, Activity, Dumbbell, User2, Bell, RefreshCcw, Camera } from "lucide-react";
import { useRouter } from "next/navigation";

type TrackingType = "WEIGHT_REPS" | "REPS_ONLY" | "TIME" | "UNILATERAL";

type SetRecord = { 
  weight: string; 
  reps: string; 
  repsLeft?: string;
  repsRight?: string;
  timeSecs?: string;
  completed: boolean; 
};

type ExerciseRecord = { 
  id: string; 
  name: string; 
  trackingType: TrackingType;
  photoUrl?: string; // base64
  sets: SetRecord[] 
};

export default function WorkoutApp() {
  const router = useRouter();
  
  // Workout State
  const [exercises, setExercises] = useState<ExerciseRecord[]>([]);
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  
  // Modals & Views
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Timer State
  const [timerEndTime, setTimerEndTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [aiTip, setAiTip] = useState<string>("Conectando con tus músculos...");
  const defaultRest = 90; // 1.5 mins
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load / Save Draft
  useEffect(() => {
    const saved = localStorage.getItem("appgym_workout_draft_v4");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.exercises) setExercises(parsed.exercises);
        if (parsed.timerEndTime) {
          const rem = Math.round((parsed.timerEndTime - Date.now()) / 1000);
          if (rem > 0) setTimerEndTime(parsed.timerEndTime);
        }
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("appgym_workout_draft_v4", JSON.stringify({ exercises, timerEndTime }));
  }, [exercises, timerEndTime]);

  // Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerEndTime) {
      interval = setInterval(() => {
        const remaining = Math.max(0, Math.round((timerEndTime - Date.now()) / 1000));
        setTimeLeft(remaining);
        if (remaining === 0) setTimerEndTime(null);
      }, 500);
    } else {
      setTimeLeft(0);
    }
    return () => clearInterval(interval);
  }, [timerEndTime]);

  const updateSet = (exId: string, setIndex: number, field: keyof SetRecord, value: string) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exId) return ex;
        const newSets = [...ex.sets];
        newSets[setIndex] = { ...newSets[setIndex], [field]: value };
        return { ...ex, sets: newSets };
      })
    );
  };

  const completeSet = (exId: string, setIndex: number) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exId) return ex;
        const newSets = [...ex.sets];
        newSets[setIndex].completed = true;
        if (setIndex === newSets.length - 1) {
          newSets.push({ ...newSets[setIndex], completed: false });
        }
        return { ...ex, sets: newSets };
      })
    );
    // Fetch AI Tip
    const ex = exercises.find(e => e.id === exId);
    if (ex) {
       fetch("/api/ai/tip", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ exercise: ex.name, setNum: setIndex + 1 })
       })
       .then(r => r.json())
       .then(d => { if (d.tip) setAiTip(d.tip); })
       .catch(() => setAiTip("¡No pares ahora! Controla la excéntrica y empuja fuerte."));
    }
    setTimerEndTime(Date.now() + defaultRest * 1000);
  };

  const saveWorkout = async () => {
    setIsSaving(true);
    try {
      const validExercises = exercises.map(ex => ({
        ...ex,
        sets: ex.sets.filter(s => s.completed)
      })).filter(ex => ex.sets.length > 0);

      const res = await fetch("/api/workout/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "ENTRENO KINETIC",
          exercises: validExercises
        })
      });
      if (res.ok) {
        localStorage.removeItem("appgym_workout_draft_v4");
        router.push("/dashboard");
      }
    } catch (e) {}
    setIsSaving(false);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // --- FOCUS MODE (ACTIVE WORKOUT) ---
  if (activeExerciseId) {
    const activeEx = exercises.find((e) => e.id === activeExerciseId)!;
    const currentSetIndex = activeEx.sets.findIndex(s => !s.completed);
    const activeSet = currentSetIndex !== -1 ? activeEx.sets[currentSetIndex] : activeEx.sets[activeEx.sets.length - 1];
    const isCompletedAll = currentSetIndex === -1;
    const isTimerRunning = timeLeft > 0;

    const words = activeEx.name.split(" ");
    const word1 = words[0];
    const word2 = words.slice(1).join(" ");

    return (
      <div className="fixed inset-0 bg-[#050505] z-50 flex flex-col font-sans animate-in fade-in duration-300">
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 bg-[#050505]/80 backdrop-blur-xl z-10 sticky top-0">
          <button onClick={() => setActiveExerciseId(null)} className="text-zinc-400 p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
          <div className="bg-[#111] border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-300 shadow-md">
            ENTRENO ACTIVO
          </div>
        </div>

        {/* IMAGE & TITLE CARD */}
        <div className="px-6 relative animate-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
           <div className="relative h-64 rounded-[32px] overflow-hidden bg-zinc-900 border border-white/5">
              <input type="file" ref={fileInputRef} onChange={(e) => {
                 const file = e.target.files?.[0];
                 if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setExercises(prev => prev.map(ex => ex.id === activeEx.id ? { ...ex, photoUrl: reader.result as string } : ex));
                    reader.readAsDataURL(file);
                 }
              }} accept="image/*" capture="environment" className="hidden" />
              
              {activeEx.photoUrl ? (
                 <img src={activeEx.photoUrl} className="w-full h-full object-cover scale-105 transition-transform duration-1000" onClick={() => fileInputRef.current?.click()} />
              ) : (
                 <div className="w-full h-full bg-[#111] flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors" onClick={() => fileInputRef.current?.click()}>
                    <Camera className="w-10 h-10 text-white/10 mb-2" />
                    <span className="text-zinc-700 font-bold uppercase tracking-widest text-[10px]">AÑADIR FOTO</span>
                 </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent pointer-events-none"></div>
              
              <div className="absolute bottom-6 left-6 pointer-events-none">
                 <h2 className="text-5xl font-black italic text-white uppercase leading-[0.9] tracking-tighter drop-shadow-md">
                    {word1} <br/>
                    {word2 && <span className="text-[#a855f7]">{word2}</span>}
                 </h2>
              </div>
           </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col px-6 pt-6 gap-6 overflow-y-auto no-scrollbar pb-32">
           
           {/* CURRENT SET CARD */}
           <div className="bg-[#111] rounded-[32px] p-8 flex flex-col items-center justify-center border border-white/5 relative shadow-xl animate-in slide-in-from-bottom-8 duration-500 delay-200 fill-mode-both">
              <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">
                 SERIE ACTUAL ({currentSetIndex+1}/{Math.max(currentSetIndex+1, activeEx.sets.filter(s => s.completed).length)})
              </div>
              
              <div className="flex items-center gap-4 w-full">
                 <div className="flex-1 bg-[#1a1a1a] rounded-2xl p-4 border border-white/10 focus-within:border-white/30 transition-colors flex flex-col items-center">
                    <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">PESO (KG)</span>
                    <input type="number" inputMode="decimal" value={activeSet.weight || ""} onChange={e => updateSet(activeEx.id, currentSetIndex, "weight", e.target.value)} disabled={isCompletedAll || isTimerRunning} className="bg-transparent text-white text-5xl font-black italic text-center w-full outline-none p-0 m-0" placeholder="0" />
                 </div>
                 
                 <span className="text-zinc-600 text-3xl font-black italic">×</span>
                 
                 <div className="flex-1 bg-[#a855f7]/10 rounded-2xl p-4 border border-[#a855f7]/30 focus-within:border-[#a855f7] transition-colors flex flex-col items-center">
                    <span className="text-[#a855f7] text-[10px] font-black uppercase tracking-widest mb-1">REPS</span>
                    <input type="number" inputMode="decimal" value={activeSet.reps || ""} onChange={e => updateSet(activeEx.id, currentSetIndex, "reps", e.target.value)} disabled={isCompletedAll || isTimerRunning} className="bg-transparent text-[#a855f7] text-5xl font-black italic text-center w-full outline-none p-0 m-0 drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]" placeholder="0" />
                 </div>
              </div>
           </div>

           {/* TIMER OR HISTORY */}
           {isTimerRunning ? (
              <div className="flex flex-col items-center justify-center gap-6 mt-4 animate-in zoom-in-95 duration-500">
                 <div className="relative w-40 h-40 flex items-center justify-center">
                    <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
                       <circle cx="50" cy="50" r="46" stroke="#111" strokeWidth="6" fill="none" />
                       <circle cx="50" cy="50" r="46" stroke="#FF6700" strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray="289" strokeDashoffset={289 - (289 * (timeLeft / defaultRest))} className="transition-all duration-500 ease-linear" />
                    </svg>
                    <div className="flex flex-col items-center z-10">
                       <span className="text-brand-orange text-[10px] font-black tracking-widest uppercase mb-1">DESCANSO</span>
                       <span className="text-4xl font-black italic text-white tracking-tighter">{formatTime(timeLeft)}</span>
                    </div>
                 </div>

                 <div className="bg-[#111]/80 backdrop-blur-xl border border-[#a855f7]/30 p-5 rounded-[24px] flex items-start gap-4 relative overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#a855f7]"></div>
                    <div className="w-8 h-8 rounded-full bg-[#a855f7]/20 flex items-center justify-center shrink-0">
                       <Bot className="w-4 h-4 text-[#a855f7]" />
                    </div>
                    <div>
                       <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">Kinetic AI</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-orange"></span>
                       </div>
                       <p className="text-sm text-zinc-300 font-medium leading-relaxed">{aiTip}</p>
                    </div>
                 </div>
              </div>
           ) : (
              <div className="mt-4 animate-in slide-in-from-bottom-8 duration-500 delay-300 fill-mode-both">
                 <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">SERIES ANTERIORES</h3>
                 <div className="space-y-2">
                    {activeEx.sets.map((s, idx) => s.completed && (
                       <div key={idx} className="flex justify-between items-center bg-[#111] px-5 py-4 rounded-[20px] border border-white/5">
                          <span className="text-zinc-500 font-black italic uppercase">SERIE {idx+1}</span>
                          <span className="text-white font-black italic text-lg">{s.weight}KG <span className="text-zinc-600">×</span> <span className="text-[#a855f7]">{s.reps}R</span></span>
                       </div>
                    ))}
                    {!activeEx.sets.some(s => s.completed) && (
                      <div className="bg-[#1a1a1a]/50 p-4 rounded-[20px] border border-white/5 text-center">
                         <p className="text-zinc-600 text-sm italic font-medium">Aún no hay series.</p>
                      </div>
                    )}
                 </div>
              </div>
           )}
        </div>

        {/* BOTTOM FIXED BUTTON */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent">
           {isTimerRunning ? (
              <button onClick={() => setTimerEndTime(null)} className="w-full bg-[#111] text-brand-orange border border-brand-orange/30 font-black italic text-xl uppercase py-5 rounded-[24px] shadow-[0_0_30px_rgba(255,103,0,0.1)] transition-transform active:scale-95">
                 SALTAR DESCANSO
              </button>
           ) : (
              <button onClick={() => completeSet(activeEx.id, currentSetIndex)} disabled={isCompletedAll || !activeSet.reps} className="w-full bg-[#a855f7] hover:bg-[#b57aff] disabled:bg-[#111] disabled:text-zinc-600 text-white font-black italic text-xl uppercase py-5 rounded-[24px] flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(168,85,247,0.4)] disabled:shadow-none transition-transform active:scale-95">
                 <CheckCircle2 className="w-6 h-6" /> COMPLETAR SERIE
              </button>
           )}
        </div>
      </div>
    );
  }

  // --- WORKOUT LIST (MAIN DASHBOARD) ---
  return (
    <div className="flex flex-col min-h-screen bg-[#050505] font-sans">
      
      {/* ADD EXERCISE MODAL */}
      {showAddModal && (
         <div className="fixed inset-0 bg-[#050505]/95 backdrop-blur-xl z-[60] p-6 flex flex-col justify-end">
            <div className="bg-[#111] border border-white/5 rounded-[40px] p-6 w-full mb-6 shadow-2xl animate-in slide-in-from-bottom-full duration-300">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter">AÑADIR EJERCICIO</h3>
                  <button onClick={() => setShowAddModal(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                     <X className="w-5 h-5 text-white"/>
                  </button>
               </div>
               <div className="space-y-3 max-h-[60vh] overflow-y-auto no-scrollbar">
                  {["PRESS DE BANCA", "SENTADILLA", "PESO MUERTO", "PRESS MILITAR", "CURL DE BÍCEPS", "JALÓN AL PECHO"].map(name => (
                     <button key={name} onClick={() => {
                        setExercises([...exercises, { id: Date.now().toString(), name, trackingType: "WEIGHT_REPS", sets: [{ weight: "", reps: "", completed: false }] }]);
                        setShowAddModal(false);
                     }} className="w-full text-left p-4 bg-[#1a1a1a] rounded-[24px] text-white font-black italic text-xl uppercase hover:bg-[#a855f7]/20 hover:text-[#a855f7] border border-transparent hover:border-[#a855f7]/30 transition-all">
                        {name}
                     </button>
                  ))}
               </div>
            </div>
         </div>
      )}

      {/* HEADER PRINCIPAL */}
      <div className="flex justify-between items-center p-6 pt-10 sticky top-0 bg-[#050505]/90 backdrop-blur-xl z-10 animate-in fade-in duration-500">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-full bg-[#111] border border-white/10 flex items-center justify-center"><User2 className="w-5 h-5 text-white" /></div>
           <h1 className="text-xl font-black uppercase tracking-tighter italic text-[#a855f7]">APP GYM</h1>
        </div>
        <button className="text-[#a855f7] p-2 hover:bg-[#a855f7]/10 rounded-full transition-colors"><Bell className="w-6 h-6" /></button>
      </div>

      <div className="px-6 pt-4 pb-32">
        {/* TITULO GIGANTE */}
        <div className="mb-10 animate-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mb-2">SESIÓN ACTIVA</p>
          <h2 className="text-5xl font-black italic text-white uppercase leading-[0.9] tracking-tighter">
            A DARLE <span className="text-[#a855f7]">DURO.</span><br/>
            CERO EXCUSAS.
          </h2>
        </div>

        {exercises.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center bg-[#111] border border-white/5 rounded-[40px] animate-in zoom-in-95 duration-500 delay-200 fill-mode-both">
            <Dumbbell className="w-12 h-12 text-zinc-700 mb-4" />
            <p className="text-lg font-black italic text-zinc-500 tracking-widest">AÚN NO HAY EJERCICIOS</p>
          </div>
        ) : (
          <div className="space-y-6">
            {exercises.map((ex, idx) => {
              const currentSetIndex = ex.sets.findIndex(s => !s.completed);
              const isDone = currentSetIndex === -1;
              return (
                 <div key={ex.id} onClick={() => setActiveExerciseId(ex.id)} className={`p-6 rounded-[32px] cursor-pointer relative z-10 transition-colors animate-in slide-in-from-bottom-4 duration-500 fill-mode-both ${isDone ? 'bg-[#a855f7]/10 border border-[#a855f7]/30' : 'bg-[#111] border border-white/5'}`} style={{ animationDelay: `${200 + idx * 100}ms` }}>
                   <div className="flex justify-between items-center mb-4">
                     <h3 className="font-black italic text-3xl text-white tracking-tighter uppercase">{ex.name}</h3>
                     {isDone ? <CheckCircle2 className="w-6 h-6 text-[#a855f7]" /> : <ChevronRight className="w-6 h-6 text-zinc-600" />}
                   </div>
                   
                   <div className="flex gap-2">
                     {ex.sets.map((set, i) => (
                        <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black italic transition-colors ${set.completed ? 'bg-[#a855f7] text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]' : 'bg-[#1a1a1a] text-zinc-500 border border-white/5'}`}>
                           {i+1}
                        </div>
                     ))}
                   </div>
                 </div>
              );
            })}
          </div>
        )}

        <button onClick={() => setShowAddModal(true)} className="mt-8 mb-8 w-full bg-[#1a1a1a] text-white h-[88px] rounded-[32px] flex items-center justify-center font-black italic uppercase tracking-wider text-xl hover:bg-[#a855f7]/20 hover:text-[#a855f7] border border-transparent hover:border-[#a855f7]/30 transition-all animate-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both">
          <Plus className="w-6 h-6 mr-2" /> AÑADIR EJERCICIO
        </button>

      {/* START WORKOUT BUTTON (IN FLOW) */}
      {exercises.length > 0 && (
         <div className="pb-8 animate-in slide-in-from-bottom-4 duration-500 delay-400 fill-mode-both">
            <button onClick={saveWorkout} disabled={isSaving} className="w-full bg-[#a855f7] hover:bg-[#b57aff] text-white font-black italic text-xl uppercase py-5 rounded-[24px] shadow-[0_0_40px_rgba(168,85,247,0.3)] active:scale-95 transition-transform flex justify-center items-center gap-2">
               {isSaving ? <RefreshCcw className="w-6 h-6 animate-spin" /> : 'TERMINAR ENTRENO'}
            </button>
         </div>
      )}
      </div>
    </div>
  );
}
