"use client";
import { Bell } from "lucide-react";

export default function TopNav({ user }: { user: any }) {
  return (
    <header className="flex justify-between items-center px-6 py-4 sticky top-0 bg-black/80 backdrop-blur-md z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden border border-white/10 flex items-center justify-center">
          {user?.image ? (
             <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm font-bold text-brand-purple">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
          )}
        </div>
        <h1 className="text-xl font-black italic tracking-tighter text-brand-purple">KINETIC</h1>
      </div>
      <button className="relative p-2 text-zinc-400 hover:text-white transition-colors">
        <Bell className="w-6 h-6" />
        <span className="absolute top-2 right-2 w-2 h-2 bg-brand-purple rounded-full"></span>
      </button>
    </header>
  );
}
