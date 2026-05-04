"use client";
import { Home, Dumbbell, LineChart, ClipboardList, Bot } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Inicio", href: "/dashboard", icon: Home },
    { name: "Entrenar", href: "/dashboard/train", icon: Dumbbell },
    { name: "Progreso", href: "/dashboard/progress", icon: LineChart },
    { name: "Rutinas", href: "/dashboard/routines", icon: ClipboardList },
    { name: "Coach IA", href: "/dashboard/ai", icon: Bot },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 h-16 bg-[#111]/90 backdrop-blur-xl border border-white/5 rounded-full z-50 px-6 shadow-2xl">
      <div className="flex justify-between items-center h-full gap-8">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all ${isActive ? 'bg-[#8F00FF]/20 text-[#8F00FF]' : 'text-zinc-600 hover:text-zinc-300'}`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'fill-[#8F00FF]/20' : ''}`} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
