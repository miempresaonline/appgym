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
  const [aiTip, setAiTip] = useState<string>("Buscando conexión con la mente...");
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
       .catch(() => setAiTip("Push to failure, let's go! Focus on eccentric control."));
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
          name: "KINETIC WORKOUT",
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
      <div className="fixed inset-0 bg-[#050505] z-50 flex flex-col font-sans">
        {/* HEADER */}
        <div className="flex justify-between items-center p-6">
          <button onClick={() => setActiveExerciseId(null)} className="text-zinc-400 p-2">
            <X className="w-6 h-6" />
          </button>
          <div className="bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-300">
            ACTIVE WORKOUT
          </div>
        </div>

        {/* IMAGE & TITLE CARD */}
        <div className="px-6 relative">
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
                 <img src={activeEx.photoUrl} className="w-full h-full object-cover" onClick={() => fileInputRef.current?.click()} />
              ) : (
                 <div className="w-full h-full bg-[#111] flex items-center justify-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <Camera className="w-10 h-10 text-white/10" />
                 </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050505] pointer-events-none"></div>
              
              <div className="absolute bottom-6 left-6 pointer-events-none">
                 <h2 className="text-5xl font-black italic text-white uppercase leading-none tracking-tight">
                    {word1} <br/>
                    {word2 && <span className="text-[#8F00FF]">{word2}</span>}
                 </h2>
              </div>
           </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col px-6 pt-6 gap-6 overflow-y-auto no-scrollbar pb-32">
           
           {/* CURRENT SET CARD */}
           <div className="bg-[#111] rounded-[32px] p-8 flex flex-col items-center justify-center border border-white/5 relative shadow-xl">
              <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">
                 CURRENT SET ({currentSetIndex+1}/{Math.max(currentSetIndex+1, activeEx.sets.filter(s => s.completed).length)})
              </div>
              
              <div className="flex items-baseline gap-4">
                 <div className="flex items-baseline">
                    <input type="text" inputMode="decimal" value={activeSet.weight || "0"} onChange={e => updateSet(activeEx.id, currentSetIndex, "weight", e.target.value)} disabled={isCompletedAll || isTimerRunning} className="bg-transparent text-white text-7xl font-black italic w-28 text-center outline-none p-0 m-0" />
                    <span className="text-zinc-500 text-2xl font-black italic ml-1 uppercase">KG</span>
                 </div>
                 
                 <span className="text-zinc-600 text-3xl font-black italic">×</span>
                 
                 <div className="flex items-baseline">
                    <input type="text" inputMode="decimal" value={activeSet.reps || "0"} onChange={e => updateSet(activeEx.id, currentSetIndex, "reps", e.target.value)} disabled={isCompletedAll || isTimerRunning} className="bg-transparent text-[#8F00FF] text-7xl font-black italic w-20 text-center outline-none p-0 m-0 drop-shadow-[0_0_15px_rgba(143,0,255,0.4)]" />
                    <span className="text-zinc-500 text-2xl font-black italic ml-1 uppercase">R</span>
                 </div>
              </div>
           </div>

           {/* TIMER OR HISTORY */}
           {isTimerRunning ? (
              <div className="flex flex-col items-center justify-center gap-6 mt-4">
                 <div className="relative w-40 h-40 flex items-center justify-center">
                    <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
                       <circle cx="50" cy="50" r="46" stroke="#111" strokeWidth="6" fill="none" />
                       <circle cx="50" cy="50" r="46" stroke="#FF6700" strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray="289" strokeDashoffset={289 - (289 * (timeLeft / defaultRest))} className="transition-all duration-500 ease-linear" />
                    </svg>
                    <div className="flex flex-col items-center z-10">
                       <span className="text-brand-orange text-[10px] font-black tracking-widest uppercase mb-1">REST</span>
                       <span className="text-4xl font-black italic text-white tracking-tighter">{formatTime(timeLeft)}</span>
                    </div>
                 </div>

                 <div className="bg-[#111]/80 backdrop-blur-xl border border-[#8F00FF]/30 p-5 rounded-[24px] flex items-start gap-4 relative overflow-hidden shadow-[0_0_20px_rgba(143,0,255,0.1)]">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#8F00FF]"></div>
                    <div className="w-8 h-8 rounded-full bg-[#8F00FF]/20 flex items-center justify-center shrink-0">
                       <Bot className="w-4 h-4 text-[#8F00FF]" />
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
              <div className="mt-4">
                 <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">PREVIOUS SETS</h3>
                 <div className="space-y-2">
                    {activeEx.sets.map((s, idx) => s.completed && (
                       <div key={idx} className="flex justify-between items-center bg-[#111] px-5 py-4 rounded-[20px] border border-white/5">
                          <span className="text-zinc-500 font-black italic uppercase">Set {idx+1}</span>
                          <span className="text-white font-black italic text-lg">{s.weight}KG <span className="text-zinc-600">×</span> <span className="text-[#8F00FF]">{s.reps}R</span></span>
                       </div>
                    ))}
                    {!activeEx.sets.some(s => s.completed) && <p className="text-zinc-600 text-sm italic font-medium">No sets completed yet.</p>}
                 </div>
              </div>
           )}
        </div>

        {/* BOTTOM FIXED BUTTON */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent">
           {isTimerRunning ? (
              <button onClick={() => setTimerEndTime(null)} className="w-full bg-[#111] text-brand-orange border border-brand-orange/30 font-black italic text-xl uppercase py-5 rounded-[24px] shadow-[0_0_30px_rgba(255,103,0,0.1)] transition-transform active:scale-95">
                 SKIP REST
              </button>
           ) : (
              <button onClick={() => completeSet(activeEx.id, currentSetIndex)} disabled={isCompletedAll || !activeSet.reps} className="w-full bg-[#8F00FF] hover:bg-[#a65cff] disabled:bg-[#111] disabled:text-zinc-600 text-white font-black italic text-xl uppercase py-5 rounded-[24px] flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(143,0,255,0.4)] disabled:shadow-none transition-transform active:scale-95">
                 <CheckCircle2 className="w-6 h-6" /> COMPLETE SET
              </button>
           )}
        </div>
      </div>
    );
  }

  // --- WORKOUT LIST (MAIN DASHBOARD) ---
  return (
    <div className="flex flex-col min-h-screen bg-[#050505] animate-in fade-in pb-32 font-sans">
      
      {showAddModal && (
         <div className="fixed inset-0 bg-[#050505]/95 backdrop-blur-xl z-[60] p-6 flex flex-col justify-end animate-in slide-in-from-bottom-full">
            <div className="bg-[#111] border border-white/5 rounded-[40px] p-6 w-full mb-6">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter">ADD EXERCISE</h3>
                  <button onClick={() => setShowAddModal(false)} className="p-2 bg-white/5 rounded-full"><X className="w-5 h-5 text-white"/></button>
               </div>
               <div className="space-y-3">
                  {["BENCH PRESS", "SQUAT", "DEADLIFT", "SHOULDER PRESS", "BICEP CURL", "LAT PULLDOWN"].map(name => (
                     <button key={name} onClick={() => {
                        setExercises([...exercises, { id: Date.now().toString(), name, trackingType: "WEIGHT_REPS", sets: [{ weight: "", reps: "", completed: false }] }]);
                        setShowAddModal(false);
                     }} className="w-full text-left p-4 bg-[#1a1a1a] rounded-[24px] text-white font-black italic text-xl uppercase hover:bg-[#8F00FF]/20 hover:text-[#8F00FF] transition-colors">
                        {name}
                     </button>
                  ))}
               </div>
            </div>
         </div>
      )}

      {/* HEADER PRINCIPAL */}
      <div className="flex justify-between items-center p-6 sticky top-0 bg-[#050505]/90 backdrop-blur-xl z-10">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-full bg-[#111] border border-white/10 flex items-center justify-center"><User2 className="w-5 h-5 text-white" /></div>
           <h1 className="text-xl font-black uppercase tracking-tighter italic text-[#8F00FF]">KINETIC</h1>
        </div>
        <button className="text-[#8F00FF]"><Bell className="w-6 h-6" /></button>
      </div>

      <div className="px-6 pt-4">
        {/* TITULO GIGANTE */}
        <div className="mb-10">
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mb-2">ACTIVE SESSION</p>
          <h2 className="text-5xl font-black italic text-white uppercase leading-[0.9] tracking-tighter">
            LET'S <span className="text-[#8F00FF]">SMASH IT.</span><br/>
            NO EXCUSES.
          </h2>
        </div>

        {exercises.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center bg-[#111] border border-white/5 rounded-[40px]">
            <Dumbbell className="w-12 h-12 text-zinc-700 mb-4" />
            <p className="text-lg font-black italic text-zinc-500 tracking-widest">NO EXERCISES YET</p>
          </div>
        ) : (
          <div className="space-y-6">
            {exercises.map((ex, idx) => {
              const currentSetIndex = ex.sets.findIndex(s => !s.completed);
              const isDone = currentSetIndex === -1;
              return (
                 <div key={ex.id} onClick={() => setActiveExerciseId(ex.id)} className={`p-6 rounded-[32px] cursor-pointer relative z-10 transition-colors ${isDone ? 'bg-[#8F00FF]/10 border border-[#8F00FF]/30' : 'bg-[#111] border border-white/5'}`}>
                   <div className="flex justify-between items-center mb-4">
                     <h3 className="font-black italic text-3xl text-white tracking-tighter uppercase">{ex.name}</h3>
                     {isDone ? <CheckCircle2 className="w-6 h-6 text-[#8F00FF]" /> : <ChevronRight className="w-6 h-6 text-zinc-600" />}
                   </div>
                   
                   <div className="flex gap-2">
                     {ex.sets.map((set, i) => (
                        <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black italic ${set.completed ? 'bg-[#8F00FF] text-white shadow-[0_0_10px_rgba(143,0,255,0.4)]' : 'bg-white/5 text-zinc-600'}`}>
                           {i+1}
                        </div>
                     ))}
                   </div>
                 </div>
              );
            })}
          </div>
        )}

        <button onClick={() => setShowAddModal(true)} className="mt-6 w-full bg-[#1a1a1a] text-white h-[88px] rounded-[32px] flex items-center justify-center font-black italic uppercase tracking-wider text-xl hover:bg-[#8F00FF]/20 hover:text-[#8F00FF] transition-all">
          <Plus className="w-6 h-6 mr-2" /> ADD EXERCISE
        </button>
      </div>

      {/* START WORKOUT BUTTON (FLOATING) */}
      {exercises.length > 0 && (
         <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent">
            <button onClick={saveWorkout} disabled={isSaving} className="w-full bg-[#8F00FF] text-white font-black italic text-xl uppercase py-5 rounded-[24px] shadow-[0_0_40px_rgba(143,0,255,0.4)] active:scale-95 transition-transform flex justify-center items-center gap-2">
               {isSaving ? <RefreshCcw className="w-6 h-6 animate-spin" /> : 'FINISH WORKOUT'}
            </button>
         </div>
      )}
    </div>
  );
}
