"use client";
import { Home, Dumbbell, LineChart, ClipboardList, Bot } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Train", href: "/dashboard/train", icon: Dumbbell },
    { name: "Progress", href: "/dashboard/progress", icon: LineChart },
    { name: "Routines", href: "/dashboard/routines", icon: ClipboardList },
    { name: "AI Coach", href: "/dashboard/ai", icon: Bot },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/5 z-50 px-6">
      <div className="flex justify-between items-center h-full max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all ${isActive ? 'bg-[#1a1525] text-brand-purple shadow-[0_0_15px_rgba(143,0,255,0.2)]' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
