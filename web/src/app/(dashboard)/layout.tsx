import { Sidebar } from "@/components/ui/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      {/* Sidebar Fixo Integrado */}
      <Sidebar />
      
      {/* Área Central de Visualização (deslocada para evitar sobrepor a sidebar de 64 (256px)) */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto pt-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>
    </div>
  );
}
