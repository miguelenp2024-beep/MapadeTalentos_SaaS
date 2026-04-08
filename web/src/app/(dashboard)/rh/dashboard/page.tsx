// Este Dashboard será Server-Side no futuro com dados reais. No momento deixo-o limpo.
export default function RhDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white"> Visão Geral da Empresa</h1>
        <p className="mt-2 text-slate-500">Métricas e performance dos talentos cruzados com os Guias de Cargo.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card Placeholder 1 */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div className="text-slate-500 text-sm font-medium">Guias de Cargo Ativos</div>
          <div className="mt-2 text-4xl font-extrabold text-[var(--primary)]">12</div>
          <p className="mt-2 text-xs text-green-600 font-medium">+2 posições nesta semana</p>
        </div>

        {/* Card Placeholder 2 */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div className="text-slate-500 text-sm font-medium">Avaliações Completas</div>
          <div className="mt-2 text-4xl font-extrabold text-[var(--foreground)]">48</div>
          <p className="mt-2 text-xs text-slate-500 font-medium">Participantes validados pela IA</p>
        </div>

         {/* Card Placeholder 3 */}
         <div className="glass-card p-6 flex flex-col justify-between border-blue-500/20 bg-blue-50/50 dark:bg-blue-900/10">
          <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">Nível de Sinergia Médio</div>
          <div className="mt-2 text-4xl font-extrabold text-blue-700 dark:text-blue-400">76%</div>
          <p className="mt-2 text-xs text-blue-500 font-medium">Fit Cultural global estimado</p>
        </div>
      </div>
      
      {/* Container Branco pra expansão */}
      <div className="glass-card h-96 w-full flex items-center justify-center border-dashed">
        <p className="text-slate-400">O Gráfico de Comparação Global da Empresa nascerá aqui</p>
      </div>

    </div>
  );
}
