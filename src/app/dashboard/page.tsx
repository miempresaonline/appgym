"use client";

import { Dumbbell, Plus, TrendingUp, Calendar, ArrowRight, User } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans pb-24">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-black text-white p-1.5 rounded-md">
            <Dumbbell className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">APPGYM</span>
        </div>
        <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center border border-zinc-200 overflow-hidden cursor-pointer hover:bg-zinc-200 transition-colors">
          <User className="w-5 h-5 text-zinc-600" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-8 space-y-8">
        
        {/* Saludo */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-1">
            ¡A por todas, Fran!
          </h1>
          <p className="text-zinc-500 font-medium">
            Hoy es un gran día para superar tus límites.
          </p>
        </div>

        {/* Call to Action Principal */}
        <button className="w-full bg-black text-white rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-lg shadow-black/10 active:scale-[0.98]">
          <div className="bg-white/10 p-4 rounded-full">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <div className="text-center">
            <span className="block text-xl font-bold mb-1">Empezar Entrenamiento</span>
            <span className="text-white/70 text-sm font-medium">Registra tu sesión de hoy</span>
          </div>
        </button>

        {/* Grid de Resumen */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 text-zinc-500 mb-3">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Peso Actual</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-zinc-900">78.5</span>
              <span className="text-zinc-500 font-medium">kg</span>
            </div>
            <p className="text-xs text-green-600 font-semibold mt-2 flex items-center gap-1">
              ↓ 1.2 kg desde el mes pasado
            </p>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 text-zinc-500 mb-3">
              <Calendar className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Entrenos</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-zinc-900">4</span>
              <span className="text-zinc-500 font-medium">esta semana</span>
            </div>
            <p className="text-xs text-zinc-500 font-medium mt-2">
              ¡Buen ritmo! Sigue así.
            </p>
          </div>
        </div>

        {/* Última Rutina / Próxima Rutina */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-zinc-900">Tu próxima rutina</h2>
            <button className="text-sm font-semibold text-zinc-500 hover:text-black transition-colors">
              Ver todas
            </button>
          </div>
          
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm flex items-center justify-between cursor-pointer hover:border-zinc-300 transition-colors">
            <div className="flex items-center gap-4">
              <div className="bg-zinc-100 p-3 rounded-xl">
                <Dumbbell className="w-6 h-6 text-zinc-700" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900">Día de Empuje (Pecho, Hombro, Tríceps)</h3>
                <p className="text-sm text-zinc-500 mt-1">Última vez: Hace 3 días</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-zinc-400" />
          </div>
        </div>

      </main>

      {/* Bottom Navigation (Mobile mostly) */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-zinc-200 pb-safe">
        <div className="flex justify-around items-center p-3 max-w-md mx-auto">
          <button className="flex flex-col items-center gap-1 text-black">
            <Dumbbell className="w-6 h-6" />
            <span className="text-[10px] font-bold">Entrenar</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-zinc-400 hover:text-zinc-600 transition-colors">
            <Calendar className="w-6 h-6" />
            <span className="text-[10px] font-bold">Historial</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-zinc-400 hover:text-zinc-600 transition-colors">
            <TrendingUp className="w-6 h-6" />
            <span className="text-[10px] font-bold">Progreso</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-zinc-400 hover:text-zinc-600 transition-colors">
            <User className="w-6 h-6" />
            <span className="text-[10px] font-bold">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
