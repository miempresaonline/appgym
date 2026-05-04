"use client";
import { useState, useEffect, useRef } from "react";
import { X, Plus, Save, Clock, Bot, ChevronRight, Play, Dumbbell, Minus, RotateCcw, Camera, Search, Link as LinkIcon, Settings2, CheckCircle2, ChevronDown } from "lucide-react";
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
  machineNote?: string;
  photoUrl?: string; // base64
  isSuperset?: boolean;
  sets: SetRecord[] 
};

const MUSCLES = ["Pecho", "Espalda", "Piernas", "Hombro", "Bíceps", "Tríceps", "Core", "Gemelos", "Glúteo"];

export default function WorkoutApp() {
  const router = useRouter();
  
  // Workout State
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [rpe, setRpe] = useState<string>("");
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [exercises, setExercises] = useState<ExerciseRecord[]>([]);
  
  // Preferences & Catalog
  const [defaultRest, setDefaultRest] = useState(90); // 1.5 mins
  const [pastExercises, setPastExercises] = useState<{name: string, trackingType: string}[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Modals & Views
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Timer State
  const [timerEndTime, setTimerEndTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [aiTip, setAiTip] = useState<string>("Buscando conexión con la mente...");

  // Upload ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch Past Exercises for Catalog
  useEffect(() => {
    fetch("/api/exercises/list")
      .then(res => res.json())
      .then(data => {
        if (data.exercises) setPastExercises(data.exercises);
      })
      .catch(console.error);
  }, []);

  // Auto-name generation
  useEffect(() => {
    const today = new Date().toLocaleDateString("es-ES", { day: 'numeric', month: 'short' });
    if (selectedMuscles.length > 0) {
      setName(`ENTRENAMIENTO (${today}) - ${selectedMuscles.join("/")}`);
    } else {
      setName(`ENTRENAMIENTO (${today})`);
    }
  }, [selectedMuscles]);

  // Load Draft & Timer
  useEffect(() => {
    const saved = localStorage.getItem("appgym_workout_draft");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.exercises) setExercises(parsed.exercises);
        if (parsed.notes) setNotes(parsed.notes);
        if (parsed.rpe) setRpe(parsed.rpe);
        if (parsed.selectedMuscles) setSelectedMuscles(parsed.selectedMuscles);
        if (parsed.defaultRest) setDefaultRest(parsed.defaultRest);
        if (parsed.timerEndTime) {
          const rem = Math.round((parsed.timerEndTime - Date.now()) / 1000);
          if (rem > 0) setTimerEndTime(parsed.timerEndTime);
        }
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  // Save Draft
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("appgym_workout_draft", JSON.stringify({ 
         notes, rpe, exercises, selectedMuscles, defaultRest, timerEndTime 
      }));
    }
  }, [exercises, notes, rpe, selectedMuscles, defaultRest, timerEndTime, isLoaded]);

  // Bulletproof Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerEndTime) {
      interval = setInterval(() => {
        const remaining = Math.max(0, Math.round((timerEndTime - Date.now()) / 1000));
        setTimeLeft(remaining);
        
        if (remaining === 0) {
          setTimerEndTime(null);
          if ("vibrate" in navigator) navigator.vibrate([200, 100, 200]);
          if ('mediaSession' in navigator) navigator.mediaSession.metadata = new MediaMetadata({ title: '¡A entrenar!' });
        } else if ('mediaSession' in navigator) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: `Descansando... ${formatTime(remaining)}`,
            artist: 'AppGym Pro',
            artwork: [{ src: '/icon.png', sizes: '512x512', type: 'image/png' }]
          });
        }
      }, 500);
    } else {
      setTimeLeft(0);
    }
    return () => clearInterval(interval);
  }, [timerEndTime]);

  const toggleMuscle = (m: string) => {
    setSelectedMuscles(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
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
    const s = ex?.sets[setIndex];
    if (ex && s) {
       fetch("/api/ai/tip", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ exercise: ex.name, setNum: setIndex + 1, weight: s.weight, reps: s.reps })
       })
       .then(r => r.json())
       .then(d => { if (d.tip) setAiTip(d.tip); })
       .catch(() => setAiTip("Concéntrate. Vas a destrozar la siguiente serie."));
    }
    // Start bulletproof timer
    setTimerEndTime(Date.now() + defaultRest * 1000);
  };

  const undoSet = (exId: string, setIndex: number) => {
    if(!confirm("¿Seguro que quieres deshacer esta serie?")) return;
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exId) return ex;
        const newSets = [...ex.sets];
        newSets[setIndex].completed = false;
        if (setIndex < newSets.length - 1 && !newSets[setIndex+1].completed && newSets.length > 1) {
          newSets.pop();
        }
        return { ...ex, sets: newSets };
      })
    );
    setTimerEndTime(null);
  };

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

  const adjustTimer = (amountSecs: number) => {
    if (timerEndTime) {
      setTimerEndTime(prev => prev! + amountSecs * 1000);
    } else if (amountSecs > 0) {
      setTimerEndTime(Date.now() + amountSecs * 1000);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeExerciseId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setExercises(prev => prev.map(ex => ex.id === activeExerciseId ? { ...ex, photoUrl: reader.result as string } : ex));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveWorkout = async () => {
    if (!rpe) {
      alert("Por favor, marca tu nivel de fatiga (RPE) antes de guardar.");
      return;
    }

    const hasUncompleted = exercises.some(ex => ex.sets.length > 1 && !ex.sets[ex.sets.length-1].completed && ex.sets.length > 2);
    let finalNotes = notes;
    if (hasUncompleted) {
      const reason = prompt("AppGym AI: Gymbro, veo que dejaste series a medias. ¿Cuál fue el motivo? (Fallo, dolor, falta de tiempo...)");
      if (reason) finalNotes = notes ? `${notes}\n\nMotivo series incompletas: ${reason}` : `Motivo series incompletas: ${reason}`;
    }

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
          name: name,
          notes: finalNotes,
          rpe,
          exercises: validExercises
        })
      });

      if (res.ok) {
        localStorage.removeItem("appgym_workout_draft");
        router.push("/dashboard");
      } else alert("Error al guardar en la nube.");
    } catch (e) {
      alert("Error de conexión");
    }
    setIsSaving(false);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!isLoaded) return <div className="min-h-screen bg-brand-dark" />;

  // --- MODAL AÑADIR EJERCICIO ---
  const AddExerciseModal = () => {
    const [search, setSearch] = useState("");
    const [selectedType, setSelectedType] = useState<TrackingType>("WEIGHT_REPS");
    const [machine, setMachine] = useState("");
    const [isSuperset, setIsSuperset] = useState(false);

    const filtered = pastExercises.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    const commitAdd = (finalName: string, finalType: TrackingType) => {
      const newEx: ExerciseRecord = {
        id: Date.now().toString(),
        name: finalName,
        trackingType: finalType,
        machineNote: machine || undefined,
        isSuperset: isSuperset,
        sets: [{ weight: "", reps: "", repsLeft: "", repsRight: "", timeSecs: "", completed: false }],
      };
      setExercises([...exercises, newEx]);
      setShowAddModal(false);
      setActiveExerciseId(newEx.id);
    };

    return (
      <div className="fixed inset-0 bg-[#050505] z-[60] flex flex-col animate-in slide-in-from-bottom-full duration-300">
        <div className="p-6 bg-[#0a0a0a] border-b border-white/5 sticky top-0 z-10 flex flex-col gap-6 shadow-2xl shadow-black">
          <div className="flex justify-between items-center">
            <h2 className="text-4xl font-bebas text-white uppercase tracking-wider">Añadir Ejercicio</h2>
            <button onClick={() => setShowAddModal(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
              <ChevronDown className="text-white w-6 h-6" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-4 w-6 h-6 text-brand-purple" />
            <input 
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Escribe el ejercicio..." 
              className="w-full bg-brand-surface border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-lg font-bold focus:border-brand-purple outline-none shadow-[0_0_20px_rgba(143,0,255,0.1)] transition-all"
            />
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {["WEIGHT_REPS", "REPS_ONLY", "TIME", "UNILATERAL"].map((t) => (
              <button 
                key={t} onClick={() => setSelectedType(t as TrackingType)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase shrink-0 transition-all ${selectedType === t ? 'bg-brand-purple text-white shadow-[0_0_15px_rgba(143,0,255,0.4)]' : 'bg-white/5 text-zinc-500 hover:bg-white/10'}`}
              >
                {t.replace("_", " ")}
              </button>
            ))}
          </div>

          <input 
             type="text" value={machine} onChange={e => setMachine(e.target.value)}
             placeholder="¿Qué polea o máquina? (Opcional)" 
             className="w-full bg-transparent border-b-2 border-white/10 py-3 text-lg font-bold text-white focus:border-brand-orange outline-none transition-colors"
          />

          {exercises.length > 0 && (
             <label className="flex items-center gap-3 text-base text-zinc-300 font-bold p-3 bg-brand-orange/10 border border-brand-orange/20 rounded-xl cursor-pointer">
               <input type="checkbox" checked={isSuperset} onChange={e => setIsSuperset(e.target.checked)} className="accent-brand-orange w-5 h-5 rounded" />
               <LinkIcon className="w-5 h-5 text-brand-orange" /> Vincular como Super-Serie con el anterior
             </label>
          )}

          {search.length > 0 && !filtered.find(f => f.name.toLowerCase() === search.toLowerCase()) && (
            <button onClick={() => commitAdd(search, selectedType)} className="w-full py-4 bg-brand-purple text-white rounded-2xl font-black uppercase text-sm shadow-[0_0_20px_rgba(143,0,255,0.4)] animate-pulse">
              Crear Nuevo: "{search}"
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-[#050505]">
          <h3 className="text-zinc-500 font-bebas text-2xl tracking-widest mb-4">Catálogo</h3>
          {filtered.map((p, idx) => (
            <div key={idx} onClick={() => commitAdd(p.name, (p.trackingType as TrackingType) || selectedType)} className="p-5 bg-[#111] border border-white/5 rounded-2xl flex justify-between items-center active:scale-95 transition-transform cursor-pointer hover:border-brand-purple/50 group">
              <span className="font-black text-white text-lg uppercase tracking-wide group-hover:text-brand-purple transition-colors">{p.name}</span>
              <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-brand-purple/20 transition-colors">
                <Plus className="w-6 h-6 text-brand-purple" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // --- FINISH MODAL (RPE & NOTES) ---
  const FinishModal = () => {
    return (
      <div className="fixed inset-0 bg-[#050505]/95 backdrop-blur-xl z-[70] flex flex-col p-8 animate-in fade-in duration-500">
         <div className="flex justify-between items-center mb-8">
            <h2 className="text-5xl font-bebas text-white tracking-wider">RESUMEN FINAL</h2>
            <button onClick={() => setShowFinishModal(false)} className="p-3 bg-white/10 rounded-full"><X className="text-white w-6 h-6"/></button>
         </div>

         <div className="flex-1 flex flex-col justify-center gap-10">
            <div className="space-y-6">
               <label className="block text-brand-purple font-black text-xl uppercase tracking-widest">FATIGA (RPE) *</label>
               <input type="range" min="1" max="10" value={rpe || "5"} onChange={e => setRpe(e.target.value)} className="w-full h-4 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-purple" />
               <div className="flex justify-between items-center">
                  <span className="text-zinc-500 font-black text-lg">1 (SUAVE)</span>
                  <span className="text-5xl font-bebas text-white drop-shadow-[0_0_15px_rgba(143,0,255,0.8)]">{rpe ? rpe : "?"}/10</span>
                  <span className="text-brand-tertiary font-black text-lg">10 (FALLO)</span>
               </div>
            </div>

            <div className="space-y-4">
               <label className="block text-brand-orange font-black text-xl uppercase tracking-widest">NOTAS DEL ENTRENO</label>
               <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Ej: Me dolió el hombro en press, subir kilos en sentadilla..." className="w-full bg-[#111] border-2 border-white/5 focus:border-brand-orange rounded-3xl p-6 text-lg text-white outline-none resize-none h-40 transition-colors shadow-inner" />
            </div>
         </div>

         <button 
            onClick={saveWorkout} 
            disabled={isSaving || !rpe} 
            className="w-full py-6 bg-brand-purple text-white disabled:bg-zinc-800 disabled:text-zinc-500 font-black text-2xl uppercase rounded-full shadow-[0_0_40px_rgba(143,0,255,0.4)] flex items-center justify-center gap-4 transition-all active:scale-95"
         >
            {isSaving ? "GUARDANDO..." : "CONFIRMAR Y GUARDAR"} <CheckCircle2 className="w-8 h-8" />
         </button>
      </div>
    );
  };

  // --- VISTA ACTIVA DE EJERCICIO ---
  if (activeExerciseId) {
    const activeEx = exercises.find((e) => e.id === activeExerciseId)!;
    const currentSetIndex = activeEx.sets.findIndex(s => !s.completed);
    const activeSet = currentSetIndex !== -1 ? activeEx.sets[currentSetIndex] : activeEx.sets[activeEx.sets.length - 1];
    const isCompletedAll = currentSetIndex === -1;
    const isTimerRunning = timeLeft > 0;

    return (
      <div className="fixed inset-0 bg-[#050505] z-50 flex flex-col animate-in slide-in-from-bottom-10 duration-500">
        <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" capture="environment" className="hidden" />
        
        {/* HUGE BACKGROUND IMAGE */}
        <div className="absolute inset-0 z-0">
          <img 
            src={activeEx.photoUrl || "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1470&auto=format&fit=crop"} 
            className="w-full h-[60vh] object-cover opacity-20 mix-blend-luminosity mask-image-gradient" 
            alt="Exercise bg"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/80 to-[#050505]"></div>
        </div>
        
        {/* HEADER */}
        <div className="relative z-10 flex justify-between items-center p-6">
          <button onClick={() => setActiveExerciseId(null)} className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white font-bold text-xs uppercase tracking-widest hover:bg-white/20 transition-all">
            <ChevronDown className="w-5 h-5" /> MINIMIZAR
          </button>
          <div className="bg-brand-purple/20 px-4 py-2 rounded-full border border-brand-purple/40 flex items-center gap-2 backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-purple animate-pulse shadow-[0_0_10px_#8F00FF]"></span>
            <span className="text-[10px] font-black text-brand-purple tracking-[0.2em] uppercase">Focus</span>
          </div>
        </div>

        {/* TITLE AREA */}
        <div className="relative z-10 px-6 pt-10 pb-6 flex justify-between items-end">
             <div>
                {activeEx.isSuperset && <div className="flex items-center gap-2 text-brand-orange text-xs font-black uppercase mb-3 tracking-[0.2em] bg-brand-orange/10 w-max px-3 py-1 rounded-md"><LinkIcon className="w-4 h-4"/> SuperSerie</div>}
                <h2 className="text-5xl sm:text-6xl font-bebas text-white uppercase tracking-wider drop-shadow-[0_0_30px_rgba(0,0,0,1)] leading-none">
                  {activeEx.name}
                </h2>
                {activeEx.machineNote && <p className="text-brand-purple text-sm font-black uppercase tracking-[0.2em] mt-3 bg-black/50 w-max px-3 py-1 rounded-md">{activeEx.machineNote}</p>}
             </div>
             <button onClick={() => fileInputRef.current?.click()} className="bg-black/60 p-4 rounded-full backdrop-blur-xl border-2 border-white/10 hover:border-brand-purple text-white transition-all shadow-2xl">
                <Camera className="w-6 h-6" />
             </button>
        </div>

        <div className="flex-1 relative z-10 flex flex-col">
          {/* HUGE HISTORIAL SERIES (Scrollable) */}
          <div className="px-6 flex-1 overflow-y-auto no-scrollbar pb-10">
             <div className="space-y-3">
               {activeEx.sets.map((s, idx) => (
                  <div key={idx} className={`w-full p-4 rounded-2xl flex justify-between items-center border-2 transition-all ${s.completed ? 'bg-brand-purple/10 border-brand-purple shadow-[0_0_20px_rgba(143,0,255,0.15)]' : 'bg-[#111] border-white/5'}`}>
                     <div className="flex items-center gap-4">
                        <span className={`font-bebas text-3xl ${s.completed ? 'text-brand-purple' : 'text-zinc-600'}`}>SET {idx + 1}</span>
                        {s.completed && (
                           <div className="flex items-baseline gap-2">
                              {activeEx.trackingType === 'UNILATERAL' ? (
                                 <span className="text-2xl font-black text-white">{s.repsLeft}L <span className="text-brand-purple">/</span> {s.repsRight}R</span>
                              ) : activeEx.trackingType === 'TIME' ? (
                                 <span className="text-2xl font-black text-white">{s.timeSecs}S</span>
                              ) : (
                                 <>
                                    <span className="text-3xl font-black text-white">{s.weight || '0'}</span><span className="text-sm font-bold text-zinc-500 uppercase">KG</span>
                                    <span className="text-xl font-black text-brand-purple mx-1">×</span>
                                    <span className="text-3xl font-black text-white">{s.reps || '0'}</span><span className="text-sm font-bold text-zinc-500 uppercase">REPS</span>
                                 </>
                              )}
                           </div>
                        )}
                     </div>
                     {s.completed && (
                        <button onClick={() => undoSet(activeEx.id, idx)} className="w-12 h-12 bg-black/50 rounded-xl flex items-center justify-center hover:bg-brand-tertiary/20 hover:text-brand-tertiary transition-colors">
                           <RotateCcw className="w-5 h-5 text-zinc-400" />
                        </button>
                     )}
                  </div>
               ))}
             </div>
          </div>

          {/* INPUT AREA (Bottom) */}
          <div className="bg-[#0a0a0a] border-t border-white/5 p-6 rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.8)] pb-10">
            {isTimerRunning ? (
               <div className="flex flex-col items-center animate-in zoom-in-95 duration-500">
                  <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                     <svg className="absolute w-full h-full -rotate-90 drop-shadow-[0_0_15px_#FF6700]" viewBox="0 0 100 100">
                     <circle cx="50" cy="50" r="46" stroke="#151515" strokeWidth="3" fill="none" />
                     <circle cx="50" cy="50" r="46" stroke="var(--color-brand-orange)" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="289" strokeDashoffset={289 - (289 * (timeLeft / defaultRest))} className="transition-all duration-500 ease-linear" />
                     </svg>
                     <div className="flex flex-col items-center z-10">
                     <span className="text-brand-orange text-sm font-black tracking-widest uppercase mb-1 drop-shadow-md">RESTING</span>
                     <span className="text-6xl font-bebas text-white tracking-widest">{formatTime(timeLeft)}</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-6 mb-6">
                     <button onClick={() => adjustTimer(-15)} className="text-zinc-400 px-5 py-3 bg-white/5 hover:bg-white/10 rounded-full text-sm font-black transition-colors">-15S</button>
                     <button onClick={() => setTimerEndTime(null)} className="text-brand-orange px-8 py-3 bg-brand-orange/10 border-2 border-brand-orange/20 rounded-full text-base font-black uppercase shadow-[0_0_20px_rgba(255,103,0,0.2)]">OMITIR</button>
                     <button onClick={() => adjustTimer(15)} className="text-zinc-400 px-5 py-3 bg-white/5 hover:bg-white/10 rounded-full text-sm font-black transition-colors">+15S</button>
                  </div>
                  <div className="w-full bg-[#151515] rounded-3xl p-5 flex items-center gap-4 border border-white/5 shadow-inner">
                     <div className="w-12 h-12 rounded-full bg-brand-purple/20 flex items-center justify-center shrink-0 border border-brand-purple/30"><Bot className="w-6 h-6 text-brand-purple" /></div>
                     <p className="text-base text-zinc-300 font-bold leading-tight">"{aiTip}"</p>
                  </div>
               </div>
            ) : (
               <div className="flex flex-col items-center">
                  <div className="flex items-end gap-6 justify-center mb-8 w-full px-4">
                     {activeEx.trackingType === "WEIGHT_REPS" || activeEx.trackingType === "UNILATERAL" ? (
                        <div className="flex-1 flex flex-col items-center bg-[#151515] rounded-3xl py-4 border-2 border-transparent focus-within:border-brand-purple transition-colors">
                           <span className="text-zinc-500 font-black text-sm uppercase tracking-widest mb-1">PESO</span>
                           <div className="flex items-baseline">
                              <input type="text" inputMode="decimal" pattern="[0-9]*" value={activeSet.weight} onChange={(e) => updateSet(activeEx.id, currentSetIndex, "weight", e.target.value)} className="w-24 bg-transparent text-white text-6xl font-bebas tracking-tighter text-center outline-none" placeholder="0" disabled={isCompletedAll} />
                              <span className="text-brand-purple font-black ml-1 text-2xl uppercase">KG</span>
                           </div>
                        </div>
                     ) : null}

                     {activeEx.trackingType === "WEIGHT_REPS" && (
                        <div className="flex-1 flex flex-col items-center bg-[#151515] rounded-3xl py-4 border-2 border-transparent focus-within:border-brand-purple transition-colors">
                           <span className="text-zinc-500 font-black text-sm uppercase tracking-widest mb-1">REPES</span>
                           <div className="flex items-baseline">
                              <input type="text" inputMode="decimal" pattern="[0-9]*" value={activeSet.reps} onChange={(e) => updateSet(activeEx.id, currentSetIndex, "reps", e.target.value)} className="w-24 bg-transparent text-white text-6xl font-bebas tracking-tighter text-center outline-none" placeholder="0" disabled={isCompletedAll} />
                              <span className="text-brand-purple font-black ml-1 text-2xl uppercase">R</span>
                           </div>
                        </div>
                     )}

                     {activeEx.trackingType === "UNILATERAL" && (
                        <div className="flex-1 flex gap-4">
                           <div className="flex-1 flex flex-col items-center bg-[#151515] rounded-3xl py-4 border-2 border-transparent focus-within:border-brand-tertiary transition-colors">
                              <span className="text-zinc-500 font-black text-sm uppercase tracking-widest mb-1">LEFT</span>
                              <input type="text" inputMode="decimal" value={activeSet.repsLeft || ""} onChange={(e) => updateSet(activeEx.id, currentSetIndex, "repsLeft", e.target.value)} className="w-16 bg-transparent text-brand-tertiary text-5xl font-bebas text-center outline-none" placeholder="0"/>
                           </div>
                           <div className="flex-1 flex flex-col items-center bg-[#151515] rounded-3xl py-4 border-2 border-transparent focus-within:border-brand-tertiary transition-colors">
                              <span className="text-zinc-500 font-black text-sm uppercase tracking-widest mb-1">RIGHT</span>
                              <input type="text" inputMode="decimal" value={activeSet.repsRight || ""} onChange={(e) => updateSet(activeEx.id, currentSetIndex, "repsRight", e.target.value)} className="w-16 bg-transparent text-brand-tertiary text-5xl font-bebas text-center outline-none" placeholder="0"/>
                           </div>
                        </div>
                     )}

                     {activeEx.trackingType === "TIME" && (
                        <div className="flex-1 flex flex-col items-center bg-[#151515] rounded-3xl py-4 border-2 border-transparent focus-within:border-brand-orange transition-colors">
                           <span className="text-zinc-500 font-black text-sm uppercase tracking-widest mb-1">TIEMPO</span>
                           <div className="flex items-baseline">
                              <input type="text" inputMode="decimal" value={activeSet.timeSecs || ""} onChange={(e) => updateSet(activeEx.id, currentSetIndex, "timeSecs", e.target.value)} className="w-32 bg-transparent text-brand-orange text-6xl font-bebas text-center outline-none" placeholder="0"/>
                              <span className="text-brand-orange font-black ml-1 text-2xl uppercase">SEGS</span>
                           </div>
                        </div>
                     )}

                     {activeEx.trackingType === "REPS_ONLY" && (
                        <div className="flex-1 flex flex-col items-center bg-[#151515] rounded-3xl py-4 border-2 border-transparent focus-within:border-brand-purple transition-colors">
                           <span className="text-zinc-500 font-black text-sm uppercase tracking-widest mb-1">REPETICIONES</span>
                           <div className="flex items-baseline">
                              <input type="text" inputMode="decimal" pattern="[0-9]*" value={activeSet.reps} onChange={(e) => updateSet(activeEx.id, currentSetIndex, "reps", e.target.value)} className="w-32 bg-transparent text-brand-purple text-7xl font-bebas tracking-tighter text-center outline-none" placeholder="0" disabled={isCompletedAll} />
                           </div>
                        </div>
                     )}
                  </div>
                  
                  <button 
                     onClick={() => {
                        if ((activeEx.trackingType === 'UNILATERAL' && (activeSet.repsLeft || activeSet.repsRight)) || (activeEx.trackingType === 'TIME' && activeSet.timeSecs) || (activeSet.reps)) {
                        completeSet(activeEx.id, currentSetIndex);
                        } else alert("Introduce repeticiones o datos válidos");
                     }}
                     disabled={isCompletedAll}
                     className="w-full bg-brand-purple hover:bg-[#a65cff] disabled:bg-[#1a1a1a] disabled:text-zinc-600 text-white font-bebas text-3xl py-6 rounded-full uppercase tracking-widest flex items-center justify-center shadow-[0_0_40px_rgba(143,0,255,0.4)] transition-all active:scale-95"
                  >
                     COMPLETAR SERIE
                  </button>
               </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- VISTA RESUMEN DEL ENTRENAMIENTO ---
  return (
    <div className="flex flex-col min-h-screen bg-brand-dark animate-in fade-in pb-32">
      {showAddModal && <AddExerciseModal />}
      {showFinishModal && <FinishModal />}
      
      {showSettingsModal && (
         <div className="fixed inset-0 bg-[#050505]/95 backdrop-blur-md z-[60] flex items-center justify-center p-6 animate-in fade-in">
            <div className="bg-[#111] border border-white/10 p-8 rounded-[40px] w-full max-w-sm shadow-2xl">
               <h3 className="text-brand-purple font-bebas text-4xl uppercase mb-6 tracking-wider">Ajustes del Entreno</h3>
               <label className="block text-zinc-400 text-sm font-black uppercase tracking-widest mb-3">Descanso por Defecto (Segs)</label>
               <input type="number" inputMode="decimal" value={defaultRest} onChange={e => setDefaultRest(Number(e.target.value) || 90)} className="w-full bg-[#050505] border-2 border-white/5 rounded-2xl p-5 text-3xl font-bebas text-center text-white focus:border-brand-purple outline-none mb-8 transition-colors" />
               <div className="flex gap-4">
                  <button onClick={() => setShowSettingsModal(false)} className="flex-1 py-4 bg-white/5 text-zinc-400 font-black uppercase rounded-2xl hover:bg-white/10 transition-colors">Cancelar</button>
                  <button onClick={() => setShowSettingsModal(false)} className="flex-1 py-4 bg-brand-purple text-white shadow-[0_0_20px_rgba(143,0,255,0.4)] font-black uppercase rounded-2xl">Guardar</button>
               </div>
            </div>
         </div>
      )}

      {/* HEADER PRINCIPAL */}
      <div className="flex justify-between items-center p-6 sticky top-0 bg-brand-dark/90 backdrop-blur-xl z-10 border-b border-white/5">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setShowSettingsModal(true)}>
           <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-white/10 transition-colors">
              <Settings2 className="w-5 h-5 text-brand-purple" />
           </div>
           <div>
              <h1 className="text-xl font-black uppercase tracking-tighter leading-none text-white">AppGym <span className="text-brand-purple">Pro</span></h1>
              <span className="text-[10px] text-brand-orange font-black tracking-widest uppercase">Timer: {defaultRest}s</span>
           </div>
        </div>
        <button onClick={() => setShowFinishModal(true)} disabled={exercises.length === 0} className="bg-brand-purple text-white disabled:bg-zinc-800 disabled:text-zinc-600 disabled:shadow-none px-6 py-3 rounded-full flex items-center gap-2 text-sm font-black tracking-widest uppercase shadow-[0_0_20px_rgba(143,0,255,0.4)] transition-all hover:scale-105 active:scale-95">
          FINALIZAR
        </button>
      </div>

      <div className="px-6 pt-8">
        {/* TITULO Y MUSCULOS GIGANTES */}
        <div className="mb-10">
          <h2 className="text-6xl font-bebas text-white uppercase tracking-wider leading-[0.85] mb-6 drop-shadow-lg">{name}</h2>
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
             {MUSCLES.map(m => (
                <button key={m} onClick={() => toggleMuscle(m)} className={`px-6 py-3 rounded-2xl text-sm font-black tracking-widest uppercase shrink-0 transition-all border-2 ${selectedMuscles.includes(m) ? 'bg-brand-purple border-brand-purple text-white shadow-[0_0_20px_rgba(143,0,255,0.4)]' : 'bg-transparent border-white/10 text-zinc-500 hover:border-white/30'}`}>
                   {m}
                </button>
             ))}
          </div>
        </div>

        {exercises.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center border-4 border-dashed border-white/5 rounded-[40px] bg-white/[0.02]">
            <div className="w-20 h-20 bg-brand-purple/10 rounded-full flex items-center justify-center mb-6">
               <Dumbbell className="w-10 h-10 text-brand-purple" />
            </div>
            <p className="text-lg font-bebas text-zinc-500 tracking-widest">AÑADE TU PRIMER EJERCICIO</p>
          </div>
        ) : (
          <div className="space-y-6">
            {exercises.map((ex, idx) => (
              <div key={ex.id} className="relative group">
                {ex.isSuperset && idx > 0 && (
                   <div className="absolute -top-6 left-10 bottom-full w-1 bg-brand-orange/40 z-0"></div>
                )}
                <div onClick={() => setActiveExerciseId(ex.id)} className={`bg-[#0a0a0a] border-2 ${ex.isSuperset ? 'border-brand-orange/40 shadow-[0_0_30px_rgba(255,103,0,0.1)]' : 'border-white/5 shadow-2xl'} p-6 rounded-[32px] cursor-pointer hover:border-brand-purple/50 relative z-10 transition-colors`}>
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1 pr-4">
                       {ex.isSuperset && <div className="text-brand-orange text-[10px] font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5"><LinkIcon className="w-3.5 h-3.5"/> Super-Serie</div>}
                       <h3 className="font-bebas text-4xl text-white leading-none tracking-wide">{ex.name}</h3>
                       {ex.machineNote && <span className="text-zinc-500 text-xs uppercase tracking-widest font-black mt-2 inline-block bg-white/5 px-2 py-1 rounded-md">{ex.machineNote}</span>}
                    </div>
                    {ex.photoUrl ? (
                       <img src={ex.photoUrl} className="w-16 h-16 rounded-2xl object-cover opacity-60 border border-white/10 shadow-lg" alt="machine" /> 
                    ) : (
                       <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center shrink-0">
                          <ChevronRight className="w-6 h-6 text-zinc-600" />
                       </div>
                    )}
                  </div>
                  
                  {/* Sets Summary Huge */}
                  <div className="flex flex-col gap-2">
                    {ex.sets.map((set, i) => set.completed && (
                        <div key={i} className="flex justify-between items-center bg-brand-purple/10 border border-brand-purple/20 px-4 py-3 rounded-xl">
                           <span className="text-brand-purple font-bebas text-xl tracking-wider">SET {i+1}</span>
                           <span className="text-white font-black text-lg uppercase">
                              {ex.trackingType === 'UNILATERAL' ? `${set.repsLeft}L | ${set.repsRight}R` : ex.trackingType === 'TIME' ? `${set.timeSecs} SEGS` : `${set.weight ? set.weight+'KG × ' : ''}${set.reps} REPS`}
                           </span>
                        </div>
                    ))}
                    {!ex.sets.some(s => s.completed) && (
                       <div className="text-zinc-600 font-black text-sm uppercase tracking-widest">Sin series completadas</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button onClick={() => setShowAddModal(true)} className="mt-8 w-full border-2 border-dashed border-white/20 bg-transparent text-white h-20 rounded-[32px] flex items-center justify-center gap-3 font-black uppercase tracking-widest text-sm hover:border-brand-purple hover:bg-brand-purple/5 transition-all group">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-brand-purple group-hover:text-white transition-colors">
             <Plus className="w-5 h-5" />
          </div> 
          Añadir Ejercicio
        </button>
      </div>
    </div>
  );
}
