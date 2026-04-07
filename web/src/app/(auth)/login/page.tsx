"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Integrafção com Supabase
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("Credenciais inválidas ou conta não existe.");
      setIsLoading(false);
      return;
    }

    // Como as roles gerenciam o painel de redirecionamento, enviaremos para o interceptor de auth futuramente.
    // Por enquanto, direciona para o painel provisório
    router.push("/rh/dashboard");
  };

  return (
    <>
      <div className="text-center lg:text-left mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Bem-vindo de volta
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Insira suas credenciais para acessar a plataforma.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <Input
          label="E-mail profissional"
          type="email"
          placeholder="exemplo@empresa.com.br"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="space-y-1">
          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex justify-end pt-1">
            <Link href="/login/recuperar" className="text-sm font-medium text-[var(--primary)] hover:underline">
              Esqueceu a senha?
            </Link>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-100">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
          Entrar no Sistema
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-slate-500">
        Não possui uma conta?{" "}
        <Link href="/register" className="font-semibold text-[var(--primary)] hover:underline">
          Fale com o suporte comercial
        </Link>
      </div>
    </>
  );
}
