"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Target, Users, LogOut, Settings } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export function Sidebar() {
  const pathname = usePathname();

  // Rotas preparadas do nosso Plano de Implementação
  const menuItems = [
    { name: "Painel Geral", path: "/rh/dashboard", icon: LayoutDashboard },
    { name: "Guias de Cargo", path: "/rh/guias", icon: Target },
    { name: "Participantes", path: "/rh/talentos", icon: Users },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-all">
      {/* Branding da Empresa / Whitelabel Start */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800">
        <div className="h-8 w-8 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center font-bold text-sm shadow-[var(--primary)]/30 mr-3">
          RH
        </div>
        <span className="text-white font-bold tracking-wide">SaaS Talentos</span>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-4 py-8 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-[var(--radius-md)] transition-colors ${
                isActive
                  ? "bg-[var(--primary)] text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Ações do Usuário Inferior */}
      <div className="p-4 border-t border-slate-800 flex flex-col space-y-2">
        <button className="flex items-center space-x-3 px-4 py-3 rounded-[var(--radius-md)] text-slate-400 hover:text-white hover:bg-slate-800 transition-colors w-full">
          <Settings className="w-5 h-5" />
          <span className="font-medium text-sm">Configurações</span>
        </button>
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-[var(--radius-md)] text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Sair da Conta</span>
        </button>
      </div>
    </aside>
  );
}
