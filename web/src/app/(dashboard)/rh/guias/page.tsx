import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function CargoGuidesPage() {
  
  // Vamos usar dados estruturados exatos (Mockados por enquanto) para representar a tabela cargo_guides_rows
  const mockGuides = [
    { id: "1", label: "Diretor Comercial Corporativo", version: 1, context: "Crescimento Agressivo", status: "Ativo" },
    { id: "2", label: "Desenvolvedor de Software Especialista", version: 2, context: "Reestruturação e Escalabilidade", status: "Ativo" },
    { id: "3", label: "Head de Recursos Humanos", version: 1, context: "Manutenção de Cultura", status: "Em Rascunho" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Guias de Cargo</h1>
          <p className="mt-2 text-sm text-slate-500">Determine o "Contexto da Vaga" para a Inteligência Artificial mapear os talentos necessários (Eixos de Atuação).</p>
        </div>
        <Link href="/rh/guias/criar">
          <Button size="md" className="gap-2">
            <Plus className="w-4 h-4" /> Novo Guia
          </Button>
        </Link>
      </div>

      {/* Tabela Branca Premium */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase text-xs font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Nome da Posição / Cargo</th>
                <th className="px-6 py-4">Versão</th>
                <th className="px-6 py-4">Cenário de Negócio</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {mockGuides.map((guide) => (
                <tr key={guide.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{guide.label}</td>
                  <td className="px-6 py-4 text-slate-500">v{guide.version}.0</td>
                  <td className="px-6 py-4 text-slate-500 truncate max-w-[200px]">{guide.context}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      guide.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {guide.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8">Analisar Fit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
