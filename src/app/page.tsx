"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Dumbbell } from "lucide-react";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implement credentials sign in
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <main className="min-h-screen bg-white text-black font-sans flex">
      {/* Left side: Image/Branding (hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-zinc-100 p-12 relative overflow-hidden">
        {/* Simple placeholder for a gym image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop" 
            alt="Gym" 
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <div className="bg-white text-black p-2 rounded-lg">
              <Dumbbell className="w-6 h-6" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">APPGYM</span>
          </div>
        </div>

        <div className="relative z-10 text-white">
          <h1 className="text-5xl font-extrabold tracking-tighter mb-4 leading-tight">
            Entrena de <br />verdad.
          </h1>
          <p className="text-lg text-white/80 max-w-md">
            Lleva el registro de tus rutinas, supera tus límites y alcanza tus objetivos con la plataforma definitiva.
          </p>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-12">
            <div className="bg-black text-white p-2 rounded-lg">
              <Dumbbell className="w-6 h-6" />
            </div>
            <span className="text-black font-bold text-xl tracking-tight">APPGYM</span>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
            </h2>
            <p className="text-zinc-500">
              {isLogin ? "Introduce tus datos para acceder" : "Regístrate para empezar a entrenar"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-3 text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-1.5">Contraseña</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-3 text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-sm font-medium text-zinc-600 hover:text-black">
                  ¿Has olvidado tu contraseña?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white font-semibold py-3.5 rounded-xl hover:bg-zinc-800 transition-colors flex items-center justify-center disabled:opacity-70"
            >
              {isLoading ? "Cargando..." : isLogin ? "Entrar" : "Registrarse"}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-zinc-500">O continua con</span>
            </div>
          </div>

          <button
            onClick={() => signIn('google')}
            className="w-full bg-white border border-zinc-300 text-zinc-700 font-semibold py-3.5 rounded-xl hover:bg-zinc-50 transition-colors flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>

          <div className="text-center mt-8">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium text-zinc-600 hover:text-black"
            >
              {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
