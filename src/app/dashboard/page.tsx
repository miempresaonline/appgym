import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { Bot, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function DashboardHome() {
  const session = await getServerSession(authOptions);
  
  const workoutsThisWeek = 2;
  const goalDays = 3;
  const progress = (workoutsThisWeek / goalDays) * 100;

  return (
    <div className="flex flex-col space-y-2 animate-in fade-in duration-700">
      
      {/* WEEKLY GOAL SECTION */}
      <div className="flex items-start justify-between mt-2 px-2">
        <div className="flex flex-col pt-4">
          <h3 className="text-[#888888] text-[11px] font-bold tracking-[0.15em] uppercase mb-1">Weekly Goal</h3>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-[56px] leading-[0.8] font-bold text-white tracking-tighter">{goalDays}</span>
            <span className="text-[#888888] text-sm font-medium tracking-wide uppercase">DAYS/WEEK</span>
          </div>
          <p className="text-[#a0a0a0] text-sm leading-relaxed max-w-[170px]">
            You are crushing it. 1 day left to hit your goal.
          </p>
        </div>
        
        {/* Progress Ring */}
        <div className="relative w-[130px] h-[130px] flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle cx="50" cy="50" r="42" stroke="#151515" strokeWidth="10" fill="none" />
            {/* Progress Stroke */}
            <circle 
              cx="50" cy="50" r="42" 
              stroke="#b57aff" 
              strokeWidth="10" 
              fill="none" 
              strokeLinecap="round"
              strokeDasharray="263.89" 
              strokeDashoffset={263.89 - (263.89 * progress) / 100}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center mt-1">
            <div className="flex items-baseline font-bold tracking-tight">
              <span className="text-[28px] text-white leading-none">{workoutsThisWeek}</span>
              <span className="text-[20px] text-white/40 leading-none">/{goalDays}</span>
            </div>
            <span className="text-[8px] font-bold text-[#b57aff] tracking-[0.15em] uppercase mt-2">Completed</span>
          </div>
        </div>
      </div>

      {/* CARDS STACK */}
      <div className="relative mt-12 h-[280px]">
        
        {/* Background Workout Card */}
        <div className="absolute bottom-0 left-0 right-0 h-[220px] rounded-[36px] p-[1.5px] bg-gradient-to-b from-transparent via-[#b57aff]/20 to-[#b57aff]/80 shadow-[0_0_40px_rgba(181,122,255,0.1)]">
          <div className="relative bg-[#030303] rounded-[36px] w-full h-full overflow-hidden flex flex-col justify-end p-6">
            {/* Giant Background Text */}
            <div className="absolute bottom-12 left-0 right-0 flex justify-center opacity-[0.05] pointer-events-none">
               <span className="text-[70px] font-black tracking-tighter text-white">WORKOUT</span>
            </div>
            
            <div className="relative z-10 flex justify-center mb-2">
               <span className="text-[#888888] text-[11px] font-bold tracking-[0.2em] uppercase">UPPER BODY POWER • 45 MIN</span>
            </div>
          </div>
        </div>

        {/* Foreground AI Card */}
        <div className="absolute top-0 left-4 right-4 z-10 rounded-[32px] bg-gradient-to-b from-[#2a2438] to-[#121018] border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#352d45] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-[#b57aff]" />
                </div>
                <span className="text-white text-sm font-bold tracking-wide">AppGym AI</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#ff6b00] shadow-[0_0_10px_#ff6b00]"></div>
            </div>
            
            <p className="text-[#a0a0a0] text-sm leading-relaxed mb-6 pr-4">
              ¿Qué pasa, gymbro {session?.user?.name?.split(" ")[0] || "!"}? Según los kilos que moviste la semana pasada, hoy toca enfocar el entreno en hipertrofia controlada.
            </p>

            <Link href="/dashboard/ai" className="flex items-center gap-2 text-[11px] font-bold text-[#b57aff] uppercase tracking-widest hover:text-white transition-colors">
              VIEW INSIGHTS <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
        </div>
      </div>

    </div>
  );
}
