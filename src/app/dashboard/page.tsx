import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function DashboardHome() {
  const session = await getServerSession(authOptions);
  
  // Saludo dinámico según la hora
  const hour = new Date().getHours();
  let greeting = "Buenos días";
  if (hour >= 12 && hour < 20) greeting = "Buenas tardes";
  if (hour >= 20) greeting = "Buenas noches";

  const workoutsThisWeek = 0;
  const goalDays = 3;
  const progress = (workoutsThisWeek / goalDays) * 100;

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Saludo */}
      <div className="flex flex-col">
        <h2 className="text-zinc-400 text-sm font-bold tracking-widest uppercase mb-1">{greeting}, {session?.user?.name?.split(" ")[0] || 'Atleta'}</h2>
        <h3 className="text-3xl font-black uppercase tracking-tight">OBJETIVO SEMANAL</h3>
      </div>

      {/* Objetivo Semanal & Anillo */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-black">{goalDays}</span>
            <span className="text-sm font-bold text-zinc-500 tracking-widest uppercase">DÍAS/SEM</span>
          </div>
          <p className="text-zinc-400 text-sm mt-2 max-w-[180px] leading-relaxed">
            {workoutsThisWeek === 0 
              ? `Es hora de arrancar. Tienes ${goalDays} días por delante.` 
              : workoutsThisWeek >= goalDays 
              ? "¡Objetivo cumplido! Estás imparable." 
              : `Estás en racha. Quedan ${goalDays - workoutsThisWeek} días para tu meta.`}
          </p>
        </div>
        
        {/* Anillo de progreso */}
        <div className="ml-auto relative w-28 h-28 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="#1A1A1A" strokeWidth="8" fill="none" />
            <circle 
              cx="50" cy="50" r="40" 
              stroke="#8F00FF" 
              strokeWidth="8" 
              fill="none" 
              strokeLinecap="round"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (251.2 * progress) / 100}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-2xl font-black leading-none">{workoutsThisWeek}<span className="text-zinc-500 text-lg">/{goalDays}</span></span>
            <span className="text-[8px] font-bold text-brand-purple tracking-[0.2em] uppercase mt-1">Completado</span>
          </div>
        </div>
      </div>

      {/* Kinetic AI Card */}
      <div className="relative rounded-[2rem] p-[1px] bg-gradient-to-b from-brand-purple/50 via-[#1A1A1A] to-black overflow-hidden group">
        <div className="absolute inset-0 bg-brand-purple/10 blur-xl group-hover:bg-brand-purple/20 transition-all"></div>
        <div className="relative bg-[#0d0d0d] rounded-[2rem] p-6 h-full w-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1a1525] flex items-center justify-center text-brand-purple shadow-[0_0_10px_rgba(143,0,255,0.3)]">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold tracking-widest uppercase">Kinetic AI</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse shadow-[0_0_8px_rgba(255,103,0,0.8)]"></div>
          </div>
          
          <p className="text-sm text-zinc-300 leading-relaxed mb-6 font-medium">
            Acabas de empezar en Kinetic. Te recomiendo registrar tu primer entrenamiento hoy para poder analizar tus métricas.
          </p>

          <Link href="/dashboard/ai" className="flex items-center gap-2 text-[10px] font-black text-brand-purple uppercase tracking-[0.2em] hover:text-white transition-colors">
            Ver Análisis <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Siguiente Entrenamiento */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-500">Siguiente Entrenamiento</h3>
        </div>
        
        <Link href="/dashboard/train">
          <div className="relative h-32 rounded-[2rem] overflow-hidden group border border-white/5 hover:border-brand-purple/50 transition-all cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1470&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700 grayscale"
              alt="Workout"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            <div className="absolute bottom-5 left-6">
              <h4 className="text-lg font-black uppercase tracking-wider mb-1">Entrenamiento Libre</h4>
              <p className="text-[10px] font-bold text-brand-purple tracking-[0.2em] uppercase">Toca para empezar</p>
            </div>
            <div className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-brand-purple group-hover:border-transparent transition-all">
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </div>
        </Link>
      </div>

    </div>
  );
}
