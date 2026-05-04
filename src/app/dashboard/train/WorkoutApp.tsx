"use client";
import { useState, useEffect } from "react";
import { X, Plus, Save, Clock, Bot, ChevronRight, Play, Dumbbell, Minus, RotateCcw, Camera } from "lucide-react";
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
  photoUrl?: string;
  sets: SetRecord[] 
};

const MUSCLES = ["Pecho", "Espalda", "Piernas", "Hombro", "Brazo", "Core"];
const DEFAULT_REST_TIME = 90;

export default function WorkoutApp() {
  const router = useRouter();
  
  // Workout State
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [rpe, setRpe] = useState<string>(""); // Empieza vacío para forzar interacción
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [exercises, setExercises] = useState<ExerciseRecord[]>([]);
  
  // Preferences
  const [defaultRest, setDefaultRest] = useState(DEFAULT_REST_TIME);
  
  // View State
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  
  // Timer State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Auto-name generation based on muscles
  useEffect(() => {
    if (selectedMuscles.length > 0) {
      const today = new Date().toLocaleDateString("es-ES", { day: 'numeric', month: 'short' });
      setName(`${today} - ${selectedMuscles.join("/")}`);
    }
  }, [selectedMuscles]);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("appgym_workout_draft");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.exercises && parsed.exercises.length > 0) {
          setExercises(parsed.exercises);
          setName(parsed.name || "");
          setNotes(parsed.notes || "");
          setRpe(parsed.rpe || "");
          setSelectedMuscles(parsed.selectedMuscles || []);
        }
      } catch (e) {
        console.error("Draft error", e);
      }
    }
    
    if (!name && selectedMuscles.length === 0) {
      const today = new Date().toLocaleDateString("es-ES", { weekday: 'short', day: 'numeric', month: 'short' });
      setName(`Entrenamiento Libre (${today})`);
    }
    
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("appgym_workout_draft", JSON.stringify({ name, notes, rpe, exercises, selectedMuscles }));
    }
  }, [exercises, name, notes, rpe, selectedMuscles, isLoaded]);

  // Timer Tick (Safe from Backgrounding using absolute timestamp logic inside interval)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerSeconds > 0) {
      // In real prod we'd use Date.now() diffs, but for now standard tick
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
      
      // Setup Media Session API for lock screen timer visualization
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: `Descansando... ${formatTime(timerSeconds)}`,
          artist: 'AppGym Tracker',
          artwork: [{ src: '/icon.png', sizes: '512x512', type: 'image/png' }]
        });
      }
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      if ("vibrate" in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({ title: '¡A entrenar!' });
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const toggleMuscle = (m: string) => {
    setSelectedMuscles(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
  };

  const addExercise = () => {
    const exName = prompt("Nombre del ejercicio:");
    if (!exName) return;
    
    // Simplificamos el modal a prompts para MVP rápido. En el futuro será un listado UI.
    const typeNum = prompt("Tipo:\n1: Peso+Repes\n2: Solo Repes\n3: Unilateral (Brazo a Brazo)\n4: Tiempo");
    let trackingType: TrackingType = "WEIGHT_REPS";
    if(typeNum === "2") trackingType = "REPS_ONLY";
    if(typeNum === "3") trackingType = "UNILATERAL";
    if(typeNum === "4") trackingType = "TIME";

    const machine = prompt("¿Qué máquina/polea es? (Opcional, ej: Polea Derecha, Máquina Hammer)");

    const newEx: ExerciseRecord = {
      id: Date.now().toString(),
      name: exName,
      trackingType,
      machineNote: machine || undefined,
      sets: [{ weight: "", reps: "", repsLeft: "", repsRight: "", timeSecs: "", completed: false }],
    };
    setExercises([...exercises, newEx]);
    setActiveExerciseId(newEx.id);
  };

  const completeSet = (exId: string, setIndex: number) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exId) return ex;
        const newSets = [...ex.sets];
        newSets[setIndex].completed = true;
        // Auto-add new empty set
        if (setIndex === newSets.length - 1) {
          newSets.push({ 
            weight: newSets[setIndex].weight, 
            reps: newSets[setIndex].reps, 
            repsLeft: newSets[setIndex].repsLeft,
            repsRight: newSets[setIndex].repsRight,
            timeSecs: newSets[setIndex].timeSecs,
            completed: false 
          });
        }
        return { ...ex, sets: newSets };
      })
    );
    // Start timer
    setTimerSeconds(defaultRest);
    setIsTimerRunning(true);
  };

  const undoSet = (exId: string, setIndex: number) => {
    if(!confirm("¿Seguro que quieres deshacer esta serie?")) return;
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exId) return ex;
        const newSets = [...ex.sets];
        newSets[setIndex].completed = false;
        // Si la siguiente serie estaba vacía, la borramos
        if (setIndex < newSets.length - 1 && !newSets[setIndex+1].completed && newSets.length > 1) {
          newSets.pop();
        }
        return { ...ex, sets: newSets };
      })
    );
    setIsTimerRunning(false);
    setTimerSeconds(0);
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

  const adjustTimer = (amount: number) => {
    setTimerSeconds(prev => Math.max(0, prev + amount));
  };

  const saveWorkout = async () => {
    if (!rpe) {
      alert("¡Gymbro! Dime qué tan duro ha sido el entreno (RPE) antes de terminar.");
      return;
    }

    setIsSaving(true);
    try {
      const validExercises = exercises.map(ex => ({
        ...ex,
        sets: ex.sets.filter(s => s.completed)
      })).filter(ex => ex.sets.length > 0);

      if (validExercises.length === 0) {
        alert("Añade algún set completado antes de guardar.");
        setIsSaving(false);
        return;
      }

      if (!confirm("¿Seguro que quieres terminar y guardar el entrenamiento?")) {
        setIsSaving(false);
        return;
      }

      const res = await fetch("/api/workout/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || "Entrenamiento Libre",
          notes,
          rpe,
          exercises: validExercises
        })
      });

      if (res.ok) {
        localStorage.removeItem("appgym_workout_draft");
        router.push("/dashboard");
      } else {
        alert("Error al guardar.");
      }
    } catch (e) {
      console.error(e);
      alert("Error de conexión");
    }
    setIsSaving(false);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!isLoaded) return <div className="min-h-screen bg-black" />;

  // --- VISTA ACTIVA DE EJERCICIO ---
  if (activeExerciseId) {
    const activeEx = exercises.find((e) => e.id === activeExerciseId)!;
    const currentSetIndex = activeEx.sets.findIndex(s => !s.completed);
    const activeSet = currentSetIndex !== -1 ? activeEx.sets[currentSetIndex] : activeEx.sets[activeEx.sets.length - 1];
    const isCompletedAll = currentSetIndex === -1;

    // IA Motivacional durante el descanso
    const aiTips = [
      "Suelta el móvil, gymbro. Concéntrate en la respiración.",
      "Controla la fase excéntrica en la próxima serie.",
      "Si esta serie fue fácil, ¡súbele kilos a la barra!",
      "Recuerda hidratarte. ¡Vamos a por esa hipertrofia!"
    ];
    const randomTip = aiTips[Math.floor(timerSeconds % aiTips.length)];

    return (
      <div className="fixed inset-0 bg-[#050505] z-50 flex flex-col animate-in slide-in-from-bottom-10 duration-500 overflow-y-auto">
        <div className="flex justify-between items-center p-6">
          <button onClick={() => setActiveExerciseId(null)} className="p-2 -ml-2 text-zinc-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
          <div className="bg-[#1a1525] px-4 py-1.5 rounded-full border border-[#8F00FF]/20 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8F00FF] animate-pulse"></span>
            <span className="text-[10px] font-black text-[#8F00FF] tracking-widest uppercase">Active Workout</span>
          </div>
        </div>

        <div className="relative mx-6 h-48 rounded-[32px] overflow-hidden flex items-end p-6 bg-[#111]">
          <img 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale mix-blend-luminosity" 
            alt="Exercise bg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="relative z-10 w-full flex justify-between items-end">
             <div>
                <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter shadow-black drop-shadow-2xl">
                  {activeEx.name}
                </h2>
                {activeEx.machineNote && <p className="text-[#8F00FF] text-xs font-bold uppercase tracking-widest">{activeEx.machineNote}</p>}
             </div>
             <button className="bg-black/50 p-3 rounded-full backdrop-blur-md border border-white/10 hover:border-white/30 text-white">
                <Camera className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Resumen Series Completadas (Mini Contexto) */}
        <div className="flex flex-wrap gap-2 px-6 mt-4">
          {activeEx.sets.map((s, idx) => (
             s.completed && (
                <div key={idx} className="bg-[#8F00FF]/20 text-[#8F00FF] border border-[#8F00FF]/30 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-2 cursor-pointer hover:bg-[#8F00FF]/30" onClick={() => undoSet(activeEx.id, idx)}>
                   {s.weight ? `${s.weight}kg x ` : ''}{activeEx.trackingType === 'UNILATERAL' ? `${s.repsLeft}L|${s.repsRight}R` : s.reps}
                   <RotateCcw className="w-3 h-3 text-zinc-400" />
                </div>
             )
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center px-6">
          <div className="flex items-center gap-2 mb-4">
             <span className="text-[#888888] text-[11px] font-bold tracking-[0.2em] uppercase">
               Set ({currentSetIndex !== -1 ? currentSetIndex + 1 : activeEx.sets.length})
             </span>
             {isTimerRunning && <span className="bg-[#8F00FF]/20 text-[#8F00FF] text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Serie Guardada</span>}
          </div>
          
          <div className="flex items-end gap-3 justify-center">
            {activeEx.trackingType === "WEIGHT_REPS" || activeEx.trackingType === "UNILATERAL" ? (
               <>
                  <div className="flex items-baseline border-b-2 border-white/20 focus-within:border-[#8F00FF] transition-colors pb-1">
                     <input 
                     type="text" inputMode="decimal" pattern="[0-9]*"
                     value={activeSet.weight}
                     onChange={(e) => updateSet(activeEx.id, currentSetIndex, "weight", e.target.value)}
                     className="w-24 bg-transparent text-white text-6xl font-black tracking-tighter text-center outline-none"
                     placeholder="0"
                     disabled={isCompletedAll}
                     />
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
               <div className="flex items-baseline border-b-2 border-white/20 focus-within:border-[#8F00FF] transition-colors pb-1">
                  <input type="text" inputMode="decimal" value={activeSet.timeSecs || ""} onChange={(e) => updateSet(activeEx.id, currentSetIndex, "timeSecs", e.target.value)} className="w-24 bg-transparent text-[#b57aff] text-6xl font-black text-center outline-none" placeholder="0"/>
                  <span className="text-zinc-500 font-bold ml-1 uppercase text-xl">SEGS</span>
               </div>
            ) : (
               <div className="flex items-baseline border-b-2 border-white/20 focus-within:border-[#8F00FF] transition-colors pb-1">
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
              <circle 
                cx="50" cy="50" r="46" 
                stroke="#ff6b00" 
                strokeWidth="4" 
                fill="none" 
                strokeLinecap="round"
                strokeDasharray="289"
                strokeDashoffset={isTimerRunning ? 289 - (289 * (timerSeconds / defaultRest)) : 289}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="flex flex-col items-center z-10">
              <span className="text-[#ff6b00] text-[10px] font-black tracking-widest uppercase mb-1">Rest</span>
              <span className="text-3xl font-black text-white">{formatTime(timerSeconds)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-4">
             <button onClick={() => adjustTimer(-15)} className="text-zinc-500 hover:text-white px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold tracking-widest">-15S</button>
             <button onClick={() => { setTimerSeconds(0); setIsTimerRunning(false); }} className="text-[#ff6b00] hover:text-[#ff8533] px-3 py-1 rounded-full border border-[#ff6b00]/20 bg-[#ff6b00]/10 text-[10px] font-bold tracking-widest uppercase">Skip</button>
             <button onClick={() => adjustTimer(15)} className="text-zinc-500 hover:text-white px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold tracking-widest">+15S</button>
          </div>
        </div>

        {isTimerRunning && (
           <div className="mx-6 mt-6 bg-[#111] rounded-[24px] p-5 flex items-start gap-4 border border-white/5 animate-in fade-in">
             <div className="w-8 h-8 rounded-full bg-[#1a1525] flex-shrink-0 flex items-center justify-center">
                <Bot className="w-4 h-4 text-[#8F00FF]" />
             </div>
             <p className="text-sm text-zinc-400 leading-relaxed font-medium italic">
               "{randomTip}"
             </p>
           </div>
        )}

        <div className="mt-auto p-6 pb-12 flex flex-col items-center gap-6">
          <button 
            onClick={() => {
              if ((activeEx.trackingType === 'UNILATERAL' && (activeSet.repsLeft || activeSet.repsRight)) || 
                  (activeEx.trackingType === 'TIME' && activeSet.timeSecs) ||
                  (activeSet.reps)) {
                completeSet(activeEx.id, currentSetIndex);
              } else {
                alert("Introduce repeticiones o datos válidos");
              }
            }}
            disabled={isCompletedAll || isTimerRunning}
            className="w-full bg-[#b57aff] hover:bg-[#8F00FF] disabled:bg-[#1a1a1a] disabled:text-zinc-600 text-black font-black text-sm h-16 rounded-[32px] transition-all uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(181,122,255,0.3)]"
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
      <div className="flex justify-between items-center p-6 sticky top-0 bg-[#020202]/90 backdrop-blur-md z-10 border-b border-white/5">
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-[#8F00FF]"></span>
           <h1 className="text-lg font-black uppercase tracking-tighter">AppGym <span className="text-zinc-600">Pro</span></h1>
        </div>
        <button onClick={saveWorkout} disabled={isSaving || !rpe} className="bg-[#8F00FF] text-black disabled:bg-zinc-800 disabled:text-zinc-500 px-4 py-2 rounded-full flex items-center gap-2 text-[11px] font-black tracking-widest uppercase shadow-[0_0_15px_rgba(143,0,255,0.4)] transition-all">
          {isSaving ? "Guardando..." : "Terminar"} <Save className="w-3 h-3" />
        </button>
      </div>

      <div className="flex-1 px-6 pb-24 pt-6">
        {/* Cabecera del entreno Kinetic */}
        <div className="bg-[#0a0a0a] border border-white/5 p-5 rounded-[24px] mb-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#8F00FF]/5 rounded-full blur-3xl"></div>
          
          <input 
             type="text" 
             value={name} 
             onChange={e => setName(e.target.value)}
             placeholder="Día de Pecho" 
             className="w-full bg-transparent text-2xl font-black text-white uppercase tracking-tight outline-none placeholder:text-zinc-700 mb-4"
          />
          
          <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
             {MUSCLES.map(m => (
                <button key={m} onClick={() => toggleMuscle(m)} className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase flex-shrink-0 transition-all ${selectedMuscles.includes(m) ? 'bg-[#8F00FF] text-black' : 'bg-white/5 text-zinc-500 hover:text-white'}`}>
                   {m}
                </button>
             ))}
          </div>

          <textarea 
             value={notes}
             onChange={e => setNotes(e.target.value)}
             placeholder="¿Qué tal te sientes hoy, gymbro?" 
             className="w-full bg-transparent text-sm text-zinc-400 outline-none resize-none h-12 placeholder:text-zinc-700"
          />
        </div>

        {exercises.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-center opacity-40 mt-4 border border-dashed border-zinc-800 rounded-[32px]">
            <Dumbbell className="w-12 h-12 mb-4 text-[#8F00FF]" />
            <p className="text-xs font-bold uppercase tracking-widest">Sin Ejercicios</p>
          </div>
        ) : (
          <div className="space-y-4">
            {exercises.map((ex) => (
              <div 
                key={ex.id} 
                onClick={() => setActiveExerciseId(ex.id)}
                className="bg-[#0a0a0a] border border-white/5 p-5 rounded-[24px] cursor-pointer hover:border-[#8F00FF]/30 transition-all group relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                     <h3 className="font-black uppercase tracking-wider text-base text-white">{ex.name}</h3>
                     {ex.machineNote && <span className="text-[#8F00FF] text-[9px] uppercase tracking-widest font-bold">{ex.machineNote}</span>}
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-700 group-hover:text-[#8F00FF]" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {ex.sets.map((set, i) => {
                     let label = `Set ${i+1}`;
                     if(set.completed) {
                        if(ex.trackingType === 'UNILATERAL') label = `${set.repsLeft}L|${set.repsRight}R`;
                        else if(ex.trackingType === 'TIME') label = `${set.timeSecs}s`;
                        else label = `${set.weight ? set.weight+'kg x' : ''} ${set.reps}`;
                     }
                     
                     return (
                      <div key={i} className={`text-[10px] font-bold px-3 py-1.5 rounded-md uppercase tracking-wider ${set.completed ? 'bg-[#8F00FF] text-black shadow-[0_0_10px_rgba(143,0,255,0.2)]' : 'bg-[#151515] text-zinc-500'}`}>
                        {label}
                      </div>
                     )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <button 
          onClick={addExercise}
          className="mt-4 w-full border border-white/10 hover:border-[#8F00FF] bg-[#0a0a0a] text-white hover:text-[#8F00FF] h-16 rounded-[24px] transition-all flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-[11px]"
        >
          <Plus className="w-4 h-4" /> Añadir Ejercicio
        </button>

        {/* RPE Selector - Obligatorio */}
        <div className={`mt-8 bg-[#0a0a0a] border p-5 rounded-[24px] transition-all ${rpe === "" ? 'border-[#8F00FF]/50 shadow-[0_0_20px_rgba(143,0,255,0.1)]' : 'border-white/5'}`}>
          <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center justify-between">
             <span>RPE (Fatiga)</span>
             {rpe === "" && <span className="text-[#8F00FF]">*Requerido</span>}
          </h4>
          <div className="flex flex-col gap-4">
             <input 
                type="range" min="1" max="10" value={rpe || "5"} 
                onChange={e => setRpe(e.target.value)}
                className="w-full accent-[#8F00FF]"
             />
             <div className="flex justify-between text-[10px] font-bold uppercase">
                <span className="text-zinc-600">1 (Paseo)</span>
                {rpe ? <span className="text-[#8F00FF] bg-[#8F00FF]/10 px-3 py-1 rounded-full">{rpe}/10</span> : <span className="text-zinc-600">Desliza</span>}
                <span className="text-zinc-600">10 (Fallo)</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
