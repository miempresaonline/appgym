"use client";
import { useState, useEffect, useRef } from "react";
import { X, Plus, Save, Clock, Bot, ChevronRight, Play, Dumbbell, Minus, RotateCcw, Camera, Search, Link as LinkIcon, Settings2 } from "lucide-react";
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

const MUSCLES = ["Pecho", "Espalda", "Piernas", "Hombro", "Brazo", "Core"];

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
  const [isSaving, setIsSaving] = useState(false);
  
  // Timer State (Bulletproof using absolute time)
  const [timerEndTime, setTimerEndTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

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
    if (selectedMuscles.length > 0) {
      const today = new Date().toLocaleDateString("es-ES", { day: 'numeric', month: 'short' });
      setName(`${today} - ${selectedMuscles.join("/")}`);
    }
  }, [selectedMuscles]);

  // Load Draft
  useEffect(() => {
    const saved = localStorage.getItem("appgym_workout_draft");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.exercises) setExercises(parsed.exercises);
        if (parsed.name) setName(parsed.name);
        if (parsed.notes) setNotes(parsed.notes);
        if (parsed.rpe) setRpe(parsed.rpe);
        if (parsed.selectedMuscles) setSelectedMuscles(parsed.selectedMuscles);
        if (parsed.defaultRest) setDefaultRest(parsed.defaultRest);
      } catch (e) {}
    }
    
    if (!name && selectedMuscles.length === 0) {
      const today = new Date().toLocaleDateString("es-ES", { weekday: 'short', day: 'numeric', month: 'short' });
      setName(`Entrenamiento (${today})`);
    }
    setIsLoaded(true);
  }, []);

  // Save Draft
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("appgym_workout_draft", JSON.stringify({ name, notes, rpe, exercises, selectedMuscles, defaultRest }));
    }
  }, [exercises, name, notes, rpe, selectedMuscles, defaultRest, isLoaded]);

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
      }, 500); // 500ms for more precision
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
      alert("¡Gymbro! Dime qué tan duro ha sido el entreno (RPE) deslizando la barra.");
      return;
    }

    // AI Check for skipped sets
    const hasUncompleted = exercises.some(ex => ex.sets.length > 1 && !ex.sets[ex.sets.length-1].completed && ex.sets.length > 2);
    let finalNotes = notes;
    if (hasUncompleted) {
      const reason = prompt("AppGym AI: Gymbro, veo que dejaste series a medias en algún ejercicio. ¿Ha sido por fatiga, dolor o falta de tiempo? (Opcional)");
      if (reason) finalNotes = notes ? `${notes}\n\nMotivo series incompletas: ${reason}` : `Motivo series incompletas: ${reason}`;
    }

    setIsSaving(true);
    try {
      const validExercises = exercises.map(ex => ({
        ...ex,
        sets: ex.sets.filter(s => s.completed)
      })).filter(ex => ex.sets.length > 0);

      if (validExercises.length === 0) {
        alert("Añade algún set completado antes de guardar.");
        setIsSaving(false); return;
      }

      if (!confirm("¿Seguro que quieres terminar y guardar el entrenamiento en la base de datos?")) {
        setIsSaving(false); return;
      }

      const res = await fetch("/api/workout/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || "Entrenamiento Libre",
          notes: finalNotes,
          rpe,
          exercises: validExercises
        })
      });

      if (res.ok) {
        localStorage.removeItem("appgym_workout_draft");
        router.push("/dashboard");
      } else alert("Error al guardar.");
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

  if (!isLoaded) return <div className="min-h-screen bg-[#020202]" />;

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
      <div className="fixed inset-0 bg-black/90 z-[60] flex flex-col p-6 animate-in fade-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-white uppercase tracking-widest">Catálogo</h2>
          <button onClick={() => setShowAddModal(false)}><X className="text-white w-6 h-6" /></button>
        </div>

        <div className="bg-[#111] p-4 rounded-2xl mb-6 space-y-4 border border-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
            <input 
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar o crear ejercicio..." 
              className="w-full bg-transparent border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-[#b57aff] outline-none"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {["WEIGHT_REPS", "REPS_ONLY", "TIME", "UNILATERAL"].map((t) => (
              <button 
                key={t} onClick={() => setSelectedType(t as TrackingType)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase shrink-0 transition-colors ${selectedType === t ? 'bg-[#b57aff] text-black' : 'bg-white/5 text-zinc-400'}`}
              >
                {t.replace("_", " ")}
              </button>
            ))}
          </div>

          <input 
             type="text" value={machine} onChange={e => setMachine(e.target.value)}
             placeholder="Polea, Máquina (Opcional)" 
             className="w-full bg-transparent border-b border-white/10 py-2 text-sm text-white focus:border-[#b57aff] outline-none"
          />

          {exercises.length > 0 && (
             <label className="flex items-center gap-2 text-sm text-zinc-400 font-medium">
               <input type="checkbox" checked={isSuperset} onChange={e => setIsSuperset(e.target.checked)} className="accent-[#b57aff] w-4 h-4 rounded" />
               <LinkIcon className="w-4 h-4 text-[#b57aff]" /> Vincular como SuperSerie con anterior
             </label>
          )}

          {search.length > 0 && !filtered.find(f => f.name.toLowerCase() === search.toLowerCase()) && (
            <button onClick={() => commitAdd(search, selectedType)} className="w-full py-3 bg-[#b57aff]/20 text-[#b57aff] rounded-xl font-bold uppercase text-xs border border-[#b57aff]/30">
              Crear nuevo: "{search}"
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          {filtered.map((p, idx) => (
            <div key={idx} onClick={() => commitAdd(p.name, (p.trackingType as TrackingType) || selectedType)} className="p-4 bg-[#0a0a0a] border border-white/5 rounded-xl flex justify-between items-center active:scale-95 transition-transform">
              <span className="font-bold text-white text-sm uppercase">{p.name}</span>
              <Plus className="w-5 h-5 text-[#b57aff]" />
            </div>
          ))}
        </div>
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

    const aiTips = [
      "Suelta el móvil, gymbro. Concéntrate en la respiración.",
      "Controla la fase excéntrica en la próxima serie.",
      "Si esta serie fue fácil, ¡súbele kilos a la barra!",
      "Aprovecha el descanso. La hipertrofia ocurre ahora."
    ];
    const randomTip = aiTips[Math.floor((timeLeft||0) % aiTips.length)];

    return (
      <div className="fixed inset-0 bg-[#050505] z-50 flex flex-col animate-in slide-in-from-bottom-10 duration-500 overflow-y-auto">
        <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" capture="environment" className="hidden" />
        
        <div className="flex justify-between items-center p-6">
          <button onClick={() => setActiveExerciseId(null)} className="p-2 -ml-2 text-zinc-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
          <div className="bg-[#1a1525] px-4 py-1.5 rounded-full border border-[#8F00FF]/20 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8F00FF] animate-pulse"></span>
            <span className="text-[10px] font-black text-[#8F00FF] tracking-widest uppercase">Focus Mode</span>
          </div>
        </div>

        <div className="relative mx-6 h-48 rounded-[32px] overflow-hidden flex items-end p-6 bg-[#111]">
          <img 
            src={activeEx.photoUrl || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop"} 
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity" 
            alt="Exercise bg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="relative z-10 w-full flex justify-between items-end">
             <div>
                {activeEx.isSuperset && <div className="flex items-center gap-1 text-[#ff6b00] text-[9px] font-black uppercase mb-1 tracking-widest"><LinkIcon className="w-3 h-3"/> SuperSerie</div>}
                <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter shadow-black drop-shadow-2xl leading-none">
                  {activeEx.name}
                </h2>
                {activeEx.machineNote && <p className="text-[#8F00FF] text-xs font-bold uppercase tracking-widest mt-1">{activeEx.machineNote}</p>}
             </div>
             <button onClick={() => fileInputRef.current?.click()} className="bg-black/50 p-3 rounded-full backdrop-blur-md border border-white/10 hover:border-[#8F00FF] text-white transition-colors">
                <Camera className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Resumen Series */}
        <div className="flex flex-wrap gap-2 px-6 mt-4">
          {activeEx.sets.map((s, idx) => (
             s.completed && (
                <div key={idx} className="bg-[#8F00FF]/20 text-[#8F00FF] border border-[#8F00FF]/30 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-2 cursor-pointer" onClick={() => undoSet(activeEx.id, idx)}>
                   {s.weight ? `${s.weight}kg x ` : ''}{activeEx.trackingType === 'UNILATERAL' ? `${s.repsLeft}L|${s.repsRight}R` : s.reps}
                   <RotateCcw className="w-3 h-3 text-zinc-400" />
                </div>
             )
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center px-6">
          <div className="flex items-center gap-2 mb-4">
             <span className="text-[#888888] text-[11px] font-bold tracking-[0.2em] uppercase">Set ({currentSetIndex !== -1 ? currentSetIndex + 1 : activeEx.sets.length})</span>
             {isTimerRunning && <span className="bg-[#8F00FF]/20 text-[#8F00FF] text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Serie Guardada</span>}
          </div>
          
          <div className="flex items-end gap-3 justify-center">
            {activeEx.trackingType === "WEIGHT_REPS" || activeEx.trackingType === "UNILATERAL" ? (
               <>
                  <div className="flex items-baseline border-b-2 border-white/20 focus-within:border-[#8F00FF] pb-1">
                     <input type="text" inputMode="decimal" pattern="[0-9]*" value={activeSet.weight} onChange={(e) => updateSet(activeEx.id, currentSetIndex, "weight", e.target.value)} className="w-24 bg-transparent text-white text-6xl font-black tracking-tighter text-center outline-none" placeholder="0" disabled={isCompletedAll} />
                     <span className="text-zinc-500 font-bold ml-1 uppercase text-xl">KG</span>
                  </div>
                  <span className="text-zinc-600 font-black text-4xl mx-2 pb-2">×</span>
               </>
            ) : null}

            {activeEx.trackingType === "UNILATERAL" ? (
               <div className="flex gap-2 items-center">
                  <div className="flex flex-col items-center">
                     <input type="text" inputMode="decimal" value={activeSet.repsLeft || ""} onChange={(e) => updateSet(activeEx.id, currentSetIndex, "repsLeft", e.target.value)} className="w-16 border-b-2 border-white/20 focus-within:border-[#8F00FF] bg-transparent text-[#b57aff] text-4xl font-black text-center outline-none" placeholder="0"/>
                     <span className="text-zinc-500 text-[9px] font-bold uppercase mt-1">L</span>
                  </div>
                  <span className="text-zinc-600 font-black text-2xl">/</span>
                  <div className="flex flex-col items-center">
                     <input type="text" inputMode="decimal" value={activeSet.repsRight || ""} onChange={(e) => updateSet(activeEx.id, currentSetIndex, "repsRight", e.target.value)} className="w-16 border-b-2 border-white/20 focus-within:border-[#8F00FF] bg-transparent text-[#b57aff] text-4xl font-black text-center outline-none" placeholder="0"/>
                     <span className="text-zinc-500 text-[9px] font-bold uppercase mt-1">R</span>
                  </div>
               </div>
            ) : activeEx.trackingType === "TIME" ? (
               <div className="flex items-baseline border-b-2 border-white/20 focus-within:border-[#8F00FF] pb-1">
                  <input type="text" inputMode="decimal" value={activeSet.timeSecs || ""} onChange={(e) => updateSet(activeEx.id, currentSetIndex, "timeSecs", e.target.value)} className="w-24 bg-transparent text-[#b57aff] text-6xl font-black text-center outline-none" placeholder="0"/>
                  <span className="text-zinc-500 font-bold ml-1 uppercase text-xl">SEGS</span>
               </div>
            ) : (
               <div className="flex items-baseline border-b-2 border-white/20 focus-within:border-[#8F00FF] pb-1">
                  <input type="text" inputMode="decimal" value={activeSet.reps} onChange={(e) => updateSet(activeEx.id, currentSetIndex, "reps", e.target.value)} className="w-20 bg-transparent text-[#b57aff] text-6xl font-black tracking-tighter text-center outline-none" placeholder="0" disabled={isCompletedAll} />
                  <span className="text-zinc-500 font-bold ml-1 uppercase text-xl">R</span>
               </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" stroke="#151515" strokeWidth="4" fill="none" />
              <circle cx="50" cy="50" r="46" stroke="#ff6b00" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="289" strokeDashoffset={isTimerRunning ? 289 - (289 * (timeLeft / defaultRest)) : 289} className="transition-all duration-500 ease-linear" />
            </svg>
            <div className="flex flex-col items-center z-10">
              <span className="text-[#ff6b00] text-[10px] font-black tracking-widest uppercase mb-1">Rest</span>
              <span className="text-3xl font-black text-white">{formatTime(timeLeft)}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
             <button onClick={() => adjustTimer(-15)} className="text-zinc-500 px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold">-15S</button>
             <button onClick={() => setTimerEndTime(null)} className="text-[#ff6b00] px-3 py-1 bg-[#ff6b00]/10 border border-[#ff6b00]/20 rounded-full text-[10px] font-bold uppercase">Skip</button>
             <button onClick={() => adjustTimer(15)} className="text-zinc-500 px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold">+15S</button>
          </div>
        </div>

        {isTimerRunning && (
           <div className="mx-6 mt-6 bg-[#111] rounded-[24px] p-5 flex items-start gap-4 border border-white/5">
             <div className="w-8 h-8 rounded-full bg-[#1a1525] shrink-0 flex items-center justify-center"><Bot className="w-4 h-4 text-[#8F00FF]" /></div>
             <p className="text-sm text-zinc-400 font-medium italic">"{randomTip}"</p>
           </div>
        )}

        <div className="mt-auto p-6 pb-12 flex flex-col items-center gap-6">
          <button 
            onClick={() => {
              if ((activeEx.trackingType === 'UNILATERAL' && (activeSet.repsLeft || activeSet.repsRight)) || (activeEx.trackingType === 'TIME' && activeSet.timeSecs) || (activeSet.reps)) {
                completeSet(activeEx.id, currentSetIndex);
              } else alert("Introduce repeticiones o datos válidos");
            }}
            disabled={isCompletedAll || isTimerRunning}
            className="w-full bg-[#b57aff] disabled:bg-[#1a1a1a] disabled:text-zinc-600 text-black font-black text-sm h-16 rounded-[32px] uppercase tracking-widest flex items-center justify-center shadow-[0_0_30px_rgba(181,122,255,0.3)]"
          >
            {isTimerRunning ? "DESCANSANDO..." : "COMPLETAR SERIE"}
          </button>
        </div>
      </div>
    );
  }

  // --- VISTA RESUMEN DEL ENTRENAMIENTO ---
  return (
    <div className="flex flex-col min-h-screen bg-[#020202] animate-in fade-in">
      {showAddModal && <AddExerciseModal />}
      
      {showSettingsModal && (
         <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-6 animate-in fade-in">
            <div className="bg-[#111] border border-white/10 p-6 rounded-[32px] w-full max-w-sm">
               <h3 className="text-white font-black uppercase mb-4 tracking-widest text-sm">Ajustes AppGym</h3>
               <label className="block text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2">Descanso por Defecto (Segundos)</label>
               <input type="number" inputMode="decimal" value={defaultRest} onChange={e => setDefaultRest(Number(e.target.value) || 90)} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-[#b57aff] outline-none mb-6" />
               <button onClick={() => setShowSettingsModal(false)} className="w-full py-3 bg-[#b57aff] text-black font-black uppercase rounded-xl">Guardar</button>
            </div>
         </div>
      )}

      <div className="flex justify-between items-center p-6 sticky top-0 bg-[#020202]/90 backdrop-blur-md z-10 border-b border-white/5">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowSettingsModal(true)}>
           <Settings2 className="w-5 h-5 text-[#8F00FF]" />
           <h1 className="text-lg font-black uppercase tracking-tighter">AppGym <span className="text-zinc-600">Pro</span></h1>
        </div>
        <button onClick={saveWorkout} disabled={isSaving || !rpe} className="bg-[#8F00FF] text-black disabled:bg-zinc-800 disabled:text-zinc-500 px-4 py-2 rounded-full flex items-center gap-2 text-[11px] font-black tracking-widest uppercase shadow-[0_0_15px_rgba(143,0,255,0.4)]">
          {isSaving ? "..." : "Terminar"} <Save className="w-3 h-3" />
        </button>
      </div>

      <div className="flex-1 px-6 pb-24 pt-6">
        <div className="bg-[#0a0a0a] border border-white/5 p-5 rounded-[24px] mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#8F00FF]/5 rounded-full blur-3xl"></div>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Día de Pecho" className="w-full bg-transparent text-2xl font-black text-white uppercase tracking-tight outline-none placeholder:text-zinc-700 mb-4" />
          <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
             {MUSCLES.map(m => (
                <button key={m} onClick={() => toggleMuscle(m)} className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase shrink-0 transition-all ${selectedMuscles.includes(m) ? 'bg-[#8F00FF] text-black' : 'bg-white/5 text-zinc-500 hover:text-white'}`}>{m}</button>
             ))}
          </div>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="¿Qué tal te sientes hoy, gymbro?" className="w-full bg-transparent text-sm text-zinc-400 outline-none resize-none h-12 placeholder:text-zinc-700" />
        </div>

        {exercises.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center opacity-40 border border-dashed border-zinc-800 rounded-[32px]">
            <Dumbbell className="w-12 h-12 mb-4 text-[#8F00FF]" />
            <p className="text-xs font-bold uppercase tracking-widest">Sin Ejercicios</p>
          </div>
        ) : (
          <div className="space-y-4">
            {exercises.map((ex, idx) => (
              <div key={ex.id} className="relative">
                {ex.isSuperset && idx > 0 && (
                   <div className="absolute -top-5 left-8 bottom-full w-0.5 bg-[#8F00FF]/30 z-0"></div>
                )}
                <div onClick={() => setActiveExerciseId(ex.id)} className={`bg-[#0a0a0a] border ${ex.isSuperset ? 'border-[#8F00FF]/30' : 'border-white/5'} p-5 rounded-[24px] cursor-pointer hover:border-[#8F00FF]/50 relative z-10`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                       {ex.isSuperset && <div className="text-[#8F00FF] text-[9px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><LinkIcon className="w-3 h-3"/> Vinculado</div>}
                       <h3 className="font-black uppercase tracking-wider text-base text-white leading-tight">{ex.name}</h3>
                       {ex.machineNote && <span className="text-zinc-500 text-[9px] uppercase tracking-widest font-bold">{ex.machineNote}</span>}
                    </div>
                    {ex.photoUrl ? <img src={ex.photoUrl} className="w-8 h-8 rounded-lg object-cover opacity-50" alt="machine" /> : <ChevronRight className="w-5 h-5 text-zinc-700" />}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ex.sets.map((set, i) => set.completed && (
                        <div key={i} className="text-[10px] font-bold px-3 py-1.5 rounded-md uppercase tracking-wider bg-[#8F00FF] text-black shadow-[0_0_10px_rgba(143,0,255,0.2)]">
                          {ex.trackingType === 'UNILATERAL' ? `${set.repsLeft}L|${set.repsRight}R` : ex.trackingType === 'TIME' ? `${set.timeSecs}s` : `${set.weight ? set.weight+'kg x' : ''} ${set.reps}`}
                        </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button onClick={() => setShowAddModal(true)} className="mt-4 w-full border border-white/10 bg-[#0a0a0a] text-white h-16 rounded-[24px] flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-[11px] hover:border-[#8F00FF] hover:text-[#8F00FF]">
          <Plus className="w-4 h-4" /> Añadir Ejercicio
        </button>

        <div className={`mt-8 bg-[#0a0a0a] border p-5 rounded-[24px] ${rpe === "" ? 'border-[#8F00FF]/50 shadow-[0_0_20px_rgba(143,0,255,0.1)]' : 'border-white/5'}`}>
          <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center justify-between">
             <span>RPE (Fatiga)</span>
             {rpe === "" && <span className="text-[#8F00FF]">*Requerido</span>}
          </h4>
          <input type="range" min="1" max="10" value={rpe || "5"} onChange={e => setRpe(e.target.value)} className="w-full accent-[#8F00FF] mb-2" />
          <div className="flex justify-between text-[10px] font-bold uppercase">
             <span className="text-zinc-600">1 (Paseo)</span>
             {rpe ? <span className="text-[#8F00FF] bg-[#8F00FF]/10 px-3 py-1 rounded-full">{rpe}/10</span> : <span className="text-zinc-600">Desliza</span>}
             <span className="text-zinc-600">10 (Fallo)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
