"use client";
import { useState, useEffect } from "react";
import { X, Plus, Save, Clock, Bot, ChevronRight, Play, Dumbbell, Minus, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

type SetRecord = { weight: string; reps: string; completed: boolean };
type ExerciseRecord = { id: string; name: string; sets: SetRecord[] };

export default function WorkoutApp() {
  const router = useRouter();
  
  // Workout State
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [rpe, setRpe] = useState<string>("5");
  const [exercises, setExercises] = useState<ExerciseRecord[]>([]);
  
  // View State
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  
  // Timer State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

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
          setRpe(parsed.rpe || "5");
        }
      } catch (e) {
        console.error("Draft error", e);
      }
    }
    
    // Set default name if empty
    if (!name) {
      const today = new Date().toLocaleDateString("es-ES", { weekday: 'short', day: 'numeric', month: 'short' });
      setName(`Entrenamiento Libre (${today})`);
    }
    
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("appgym_workout_draft", JSON.stringify({ name, notes, rpe, exercises }));
    }
  }, [exercises, name, notes, rpe, isLoaded]);

  // Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      if ("vibrate" in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const addExercise = () => {
    const exName = prompt("Nombre del ejercicio (ej. Press Banca):");
    if (!exName) return;
    const newEx = {
      id: Date.now().toString(),
      name: exName,
      sets: [{ weight: "", reps: "", completed: false }],
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
          newSets.push({ weight: newSets[setIndex].weight, reps: newSets[setIndex].reps, completed: false });
        }
        return { ...ex, sets: newSets };
      })
    );
    // Start timer
    setTimerSeconds(90);
    setIsTimerRunning(true);
  };

  const updateSet = (exId: string, setIndex: number, field: "weight"|"reps", value: string) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exId) return ex;
        const newSets = [...ex.sets];
        newSets[setIndex][field] = value;
        return { ...ex, sets: newSets };
      })
    );
  };

  const adjustTimer = (amount: number) => {
    setTimerSeconds(prev => Math.max(0, prev + amount));
  };

  const saveWorkout = async () => {
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

  if (!isLoaded) return <div className="min-h-screen bg-black" />; // Avoid hydration mismatch flash

  // --- VISTA ACTIVA DE EJERCICIO ---
  if (activeExerciseId) {
    const activeEx = exercises.find((e) => e.id === activeExerciseId)!;
    const currentSetIndex = activeEx.sets.findIndex(s => !s.completed);
    const activeSet = currentSetIndex !== -1 ? activeEx.sets[currentSetIndex] : activeEx.sets[activeEx.sets.length - 1];
    const isCompletedAll = currentSetIndex === -1;

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
          <h2 className="relative z-10 text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter shadow-black drop-shadow-2xl">
            {activeEx.name}
          </h2>
        </div>

        <div className="mt-8 flex flex-col items-center px-6">
          <div className="flex items-center gap-2 mb-4">
             <span className="text-[#888888] text-[11px] font-bold tracking-[0.2em] uppercase">
               Set ({currentSetIndex !== -1 ? currentSetIndex + 1 : activeEx.sets.length})
             </span>
             {isTimerRunning && <span className="bg-[#8F00FF]/20 text-[#8F00FF] text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Serie Guardada</span>}
          </div>
          
          <div className="flex items-end gap-3 justify-center">
            <div className="flex items-baseline border-b-2 border-white/20 focus-within:border-[#8F00FF] transition-colors pb-1">
              <input 
                type="number" 
                value={activeSet.weight}
                onChange={(e) => updateSet(activeEx.id, currentSetIndex, "weight", e.target.value)}
                className="w-24 bg-transparent text-white text-6xl font-black tracking-tighter text-center outline-none"
                placeholder="0"
                disabled={isCompletedAll}
              />
              <span className="text-zinc-500 font-bold ml-1 uppercase text-xl">KG</span>
            </div>
            
            <span className="text-zinc-600 font-black text-4xl mx-2 pb-2">×</span>

            <div className="flex items-baseline border-b-2 border-white/20 focus-within:border-[#8F00FF] transition-colors pb-1">
              <input 
                type="number" 
                value={activeSet.reps}
                onChange={(e) => updateSet(activeEx.id, currentSetIndex, "reps", e.target.value)}
                className="w-20 bg-transparent text-[#b57aff] text-6xl font-black tracking-tighter text-center outline-none"
                placeholder="0"
                disabled={isCompletedAll}
              />
              <span className="text-zinc-500 font-bold ml-1 uppercase text-xl">R</span>
            </div>
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
                strokeDashoffset={isTimerRunning ? 289 - (289 * (timerSeconds / 90)) : 289}
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

        <div className="mt-auto p-6 pb-12 flex flex-col items-center gap-6">
          <button 
            onClick={() => {
              if (activeSet.weight && activeSet.reps) {
                completeSet(activeEx.id, currentSetIndex);
              } else {
                alert("Introduce peso y repeticiones");
              }
            }}
            disabled={isCompletedAll || isTimerRunning}
            className="w-full bg-[#b57aff] hover:bg-[#8F00FF] disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-black text-sm h-16 rounded-[32px] transition-all uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(181,122,255,0.3)]"
          >
            {isTimerRunning ? "DESCANSANDO..." : "COMPLETAR SERIE"}
          </button>
        </div>
      </div>
    );
  }

  // --- VISTA RESUMEN DEL ENTRENAMIENTO ---
  return (
    <div className="flex flex-col min-h-screen bg-black animate-in fade-in">
      <div className="flex justify-between items-center p-6 sticky top-0 bg-black/80 backdrop-blur-md z-10">
        <h1 className="text-xl font-black uppercase tracking-tighter">Entrenamiento</h1>
        <button onClick={saveWorkout} disabled={isSaving} className="bg-[#8F00FF] text-black px-4 py-2 rounded-full flex items-center gap-2 text-[11px] font-black tracking-widest uppercase shadow-[0_0_15px_rgba(143,0,255,0.4)]">
          {isSaving ? "Guardando..." : "Terminar"} <Save className="w-3 h-3" />
        </button>
      </div>

      <div className="flex-1 px-6 pb-24">
        {/* Cabecera del entreno */}
        <div className="bg-[#0a0a0a] border border-white/5 p-5 rounded-[24px] mb-6">
          <input 
             type="text" 
             value={name} 
             onChange={e => setName(e.target.value)}
             placeholder="Nombre del entreno (ej: Día de Pecho)" 
             className="w-full bg-transparent text-xl font-black text-white uppercase tracking-tight outline-none placeholder:text-zinc-600 mb-4 border-b border-white/10 pb-2 focus:border-[#8F00FF] transition-colors"
          />
          <textarea 
             value={notes}
             onChange={e => setNotes(e.target.value)}
             placeholder="Añade notas, cómo te sientes, músculos trabajados..." 
             className="w-full bg-transparent text-sm text-zinc-400 outline-none resize-none h-16 placeholder:text-zinc-600"
          />
        </div>

        {exercises.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-center opacity-50 mt-4">
            <Dumbbell className="w-12 h-12 mb-4 text-[#b57aff]" />
            <p className="text-sm font-medium">Entrenamiento vacío. Añade tu primer ejercicio.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {exercises.map((ex) => (
              <div 
                key={ex.id} 
                onClick={() => setActiveExerciseId(ex.id)}
                className="bg-[#111] border border-white/5 p-5 rounded-[24px] cursor-pointer hover:border-[#8F00FF]/30 transition-colors group"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-black uppercase tracking-wider text-base">{ex.name}</h3>
                  <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-[#8F00FF]" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {ex.sets.map((set, i) => (
                    <div key={i} className={`text-[10px] font-bold px-3 py-1.5 rounded-md uppercase tracking-wider ${set.completed ? 'bg-[#8F00FF] text-black shadow-[0_0_10px_rgba(143,0,255,0.3)]' : 'bg-zinc-800 text-zinc-400'}`}>
                      {set.weight ? `${set.weight}kg × ${set.reps}` : `Set ${i+1}`}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <button 
          onClick={addExercise}
          className="mt-6 w-full border border-dashed border-zinc-700 hover:border-[#8F00FF] text-zinc-500 hover:text-[#8F00FF] h-16 rounded-[24px] transition-all flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-[11px]"
        >
          <Plus className="w-4 h-4" /> Añadir Ejercicio
        </button>

        {/* Fatiga (RPE) */}
        {exercises.length > 0 && (
          <div className="mt-8 bg-[#0a0a0a] border border-white/5 p-5 rounded-[24px]">
            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 text-center">¿Qué tan duro fue? (RPE)</h4>
            <div className="flex flex-col gap-2">
               <input 
                  type="range" min="1" max="10" value={rpe} onChange={e => setRpe(e.target.value)}
                  className="w-full accent-[#8F00FF]"
               />
               <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase">
                  <span>1 (Paseo)</span>
                  <span className="text-[#8F00FF] text-sm">{rpe}/10</span>
                  <span>10 (Al Fallo)</span>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
