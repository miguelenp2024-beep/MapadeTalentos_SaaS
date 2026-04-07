export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      {/* Lado Esquerdo - Branding Whitelabel (Oculto em telas menores) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 border-r border-slate-800 relative flex-col justify-between overflow-hidden p-12">
        {/* Background Gradients Mágicos */}
        <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-[var(--primary)]/20 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="h-12 w-12 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center font-bold text-xl shadow-lg mb-8">
            RH
          </div>
          <h2 className="text-white text-4xl font-bold max-w-lg mb-4">
            Gestão inteligente impulsionada por Psicologia Positiva e IA.
          </h2>
          <p className="text-slate-400 text-lg max-w-md">
            Identifique talentos genuínos e aloque pessoas na exata intercessão do que amam fazer e do que a empresa precisa alcançar.
          </p>
        </div>

        <div className="relative z-10 text-slate-500 text-sm">
          &copy; 2026 SaaS Mapa de Talentos. All rights reserved.
        </div>
      </div>

      {/* Lado Direito - Formulários */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
          {children}
        </div>
      </div>
    </div>
  );
}
