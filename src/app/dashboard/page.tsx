import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { ArrowRight, Activity, Heart, Calendar } from "lucide-react";
import Link from "next/link";

export default async function DashboardHome() {
  const session = await getServerSession(authOptions);
  const name = session?.user?.name?.split(" ")[0].toUpperCase() || "ALEX";

  return (
    <div className="flex flex-col animate-in fade-in duration-700 font-sans pb-32">
      
      {/* HEADER SECTION */}
      <div className="px-6 mt-4 mb-8">
        <span className="text-[10px] text-zinc-500 font-black tracking-widest uppercase mb-2 block">
          DAILY MISSION
        </span>
        <h2 className="text-5xl font-black italic text-white uppercase leading-[0.9] tracking-tighter">
          HELLO, {name}.<br/>
          READY TO <br/>
          <span className="text-[#a855f7]">SMASH IT?</span>
        </h2>
      </div>

      {/* ACTIVE PROGRAM CARD */}
      <div className="px-6 mb-8">
        <div className="relative rounded-[32px] w-full h-[320px] bg-zinc-900 border border-white/5 flex flex-col justify-end p-6 mb-4">
          <img 
            src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1470&auto=format&fit=crop" 
            alt="Workout" 
            className="absolute inset-0 w-full h-full object-cover rounded-[32px] opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent rounded-[32px]"></div>
          
          <div className="relative z-10">
             <span className="text-[#FF6700] text-[10px] font-black uppercase tracking-widest mb-2 block">
                ACTIVE PROGRAM
             </span>
             <h3 className="text-4xl font-black italic text-white uppercase leading-none tracking-tighter mb-3 drop-shadow-md">
                UPPER BODY<br/>
                POWER
             </h3>
             <div className="flex items-center gap-2 text-zinc-300 text-xs font-bold uppercase tracking-widest">
                <span>45 MIN</span>
                <div className="w-1 h-1 rounded-full bg-zinc-500"></div>
                <span>850 KCAL</span>
             </div>
          </div>
        </div>
        <Link href="/dashboard/train" className="w-full bg-[#a855f7] hover:bg-[#b57aff] text-white py-5 rounded-full flex items-center justify-center font-black italic text-lg uppercase tracking-wide shadow-[0_10px_30px_rgba(168,85,247,0.3)] transition-transform active:scale-95">
           START WORKOUT
        </Link>
      </div>

      {/* PERFORMANCE SECTION */}
      <div className="px-6 mb-10">
        <div className="flex justify-between items-end mb-4">
           <h3 className="text-2xl font-black italic text-white tracking-tighter uppercase">PERFORMANCE</h3>
           <span className="text-[#8F00FF] text-[10px] font-black tracking-widest uppercase">WEEK 04</span>
        </div>

        <div className="flex gap-4">
           {/* CONSISTENCY CARD */}
           <div className="flex-1 bg-[#111] border border-white/5 rounded-[24px] p-5 flex flex-col justify-center">
              <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">CONSISTENCY</span>
              <div className="text-4xl font-black italic text-white tracking-tighter leading-none mb-2">2<span className="text-zinc-500 text-2xl">/3</span></div>
              <div className="w-full h-1 bg-white/10 rounded-full mb-3 overflow-hidden">
                 <div className="h-full w-2/3 bg-[#8F00FF] rounded-full"></div>
              </div>
              <span className="text-zinc-500 text-[9px] font-black uppercase tracking-widest leading-none">DAYS<br/>COMPLETED</span>
           </div>

           {/* AVG HR CARD */}
           <div className="flex-1 bg-[#111] border border-white/5 rounded-[24px] p-5 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                 <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">AVG HR</span>
                 <Heart className="w-4 h-4 text-[#FF6700]" />
              </div>
              <div className="text-4xl font-black italic text-white tracking-tighter leading-none mb-3">142</div>
              <div className="flex items-end gap-1.5 h-6">
                 <div className="w-4 h-2 rounded-full bg-[#FF6700]/30"></div>
                 <div className="w-4 h-3 rounded-full bg-[#FF6700]/50"></div>
                 <div className="w-4 h-4 rounded-full bg-[#FF6700]/70"></div>
                 <div className="w-5 h-6 rounded-full bg-[#FF6700] shadow-[0_0_10px_rgba(255,103,0,0.4)]"></div>
              </div>
           </div>
        </div>
      </div>

      {/* LOGGED ACTIVITY SECTION */}
      <div className="px-6">
        <div className="flex justify-between items-end mb-4">
           <h3 className="text-2xl font-black italic text-white tracking-tighter uppercase">LOGGED ACTIVITY</h3>
           <span className="text-zinc-500 text-[10px] font-black tracking-widest uppercase">SEE ALL</span>
        </div>

        <div className="space-y-3">
           <div className="bg-[#111] border border-white/5 rounded-[24px] p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center shrink-0">
                 <Activity className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                 <h4 className="font-black italic text-white text-lg uppercase tracking-tight">LEGS & CORE</h4>
                 <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">YESTERDAY • 58 MIN</span>
              </div>
              <div className="text-right">
                 <span className="font-black italic text-white text-lg">PR</span><br/>
                 <span className="text-[#FF6700] text-[10px] font-black uppercase tracking-widest">+12% VOL</span>
              </div>
           </div>

           <div className="bg-[#111] border border-white/5 rounded-[24px] p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center shrink-0">
                 <Activity className="w-5 h-5 text-[#8F00FF]" />
              </div>
              <div className="flex-1">
                 <h4 className="font-black italic text-zinc-400 text-lg uppercase tracking-tight">RECOVERY RUN</h4>
                 <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">2 DAYS AGO • 32 MIN</span>
              </div>
              <div className="text-right">
                 <span className="font-black italic text-zinc-400 text-lg">5K</span><br/>
                 <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">STEADY</span>
              </div>
           </div>
        </div>
      </div>

    </div>
  );
}
