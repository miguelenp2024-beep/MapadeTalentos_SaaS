import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-[var(--background)]">
      <div className="glass-card max-w-2xl text-center p-10 flex flex-col items-center space-y-6">
        
        {/* Simulação de Logo Whitelabel */}
        <div className="h-16 w-16 rounded-2xl bg-[var(--primary)] text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-[var(--primary)]/30">
          RH
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--foreground)]">
          Mapeie Talentos.<br/>
          <span className="text-[var(--primary)]">Alavanque Equipes.</span>
        </h1>
        
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl">
          Descubra não apenas os pontos fortes, mas entenda o contexto perfeito para cada indivíduo da sua empresa atingir seu maior potencial através da nossa IA.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4">
          <Link href="/login" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:min-w-[160px]">
              Fazer Login
            </Button>
          </Link>
          {/* Pode ser uma rota para uma LP ou contato no futuro */}
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            Agendar Demonstração
          </Button>
        </div>
      </div>
      
      {/* Background Decorativo */}
      <div className="absolute top-[-10%] sm:top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--primary)]/10 blur-[120px] pointer-events-none z-[-1]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[40%] rounded-full bg-blue-400/10 blur-[100px] pointer-events-none z-[-1]"></div>
    </main>
  );
}
