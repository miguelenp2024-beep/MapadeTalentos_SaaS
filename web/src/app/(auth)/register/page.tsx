"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { supabase } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  
  // States do formulário
  const [formData, setFormData] = useState({
    nome: "",
    empresa: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Cadastro padrão no Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.nome,
          company_name: formData.empresa,
          // Por padrão um novo cadastro direto deve ser Admin de Cliente
          initial_role: "admin_cliente",
        }
      }
    });

    if (signUpError) {
      setError(signUpError.message);
      setIsLoading(false);
      return;
    }

    setSuccess(true);
    setIsLoading(false);
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Conta Criada!</h2>
        <p className="text-slate-500">
          Enviamos um email de confirmação para <b>{formData.email}</b>. Confirme para acessar.
        </p>
        <div className="pt-4">
          <Button onClick={() => router.push("/login")} variant="outline">
            Voltar para o Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="text-center lg:text-left mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Crie seu Workspace
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Inicie a revolução na gestão de talentos da sua organização.
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Seu Nome Completo"
            placeholder="Ana Silva"
            required
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          />
           <Input
            label="Nome da Empresa"
            placeholder="Acme Corp"
            required
            value={formData.empresa}
            onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
          />
        </div>

        <Input
          label="E-mail (Login)"
          type="email"
          placeholder="admin@acmecorp.com"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <Input
          label="Criar Senha"
          type="password"
          placeholder="Mínimo 8 caracteres"
          required
          minLength={8}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />

        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-100">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full mt-2" size="lg" isLoading={isLoading}>
          Registrar Empresa
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-slate-500">
        Já tem uma conta?{" "}
        <Link href="/login" className="font-semibold text-[var(--primary)] hover:underline">
          Acesse aqui
        </Link>
      </div>
    </>
  );
}
