'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Building2, 
  UploadCloud, 
  Palette, 
  Settings, 
  Save, 
  ArrowLeft,
  CheckCircle2,
  BrainCircuit,
  Bot
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

// Schema Zod para Validação
const clientSchema = z.object({
  // Bloco 1: Básicos
  slug: z.string().min(3, 'O ID (slug) deve ter pelo menos 3 caracteres.'),
  companyName: z.string().min(2, 'O nome da empresa é obrigatório.'),
  isActive: z.boolean().default(true),

  // Bloco 2: Branding
  logoUrl: z.string().optional(), // Aceita vazio para ser preenchido caso não houver upload implementado
  primaryColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, 'Cor inválida (ex: #FFFFFF)'),
  secondaryColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, 'Cor inválida (ex: #FFFFFF)'),
  templateStyle: z.enum(['Corporate', 'Social', 'Clean', 'Tech']),

  // Bloco 3: IA & Regras (Settings)
  assessmentName: z.string().min(1, 'Defina o nome do Assessment.'),
  toneOfVoice: z.enum(['Consultivo', 'Direto', 'Acolhedor', 'Técnico']),
  aiModel: z.enum(['claude-3-5-sonnet', 'gpt-4o', 'gemini-1-5-flash']),
});

type ClientFormValues = z.infer<typeof clientSchema>;

export default function NewClientPage() {
  const router = useRouter();
  const [isAuthorizing, setIsAuthorizing] = useState(true);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [success, setSuccess] = useState(false);

  // Verificação de Role "admin_master"
  useEffect(() => {
    const checkRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      // Procura a role tanto em user_metadata quanto em app_metadata
      const userRole = session.user?.user_metadata?.role || session.user?.app_metadata?.role;
      
      console.log("Sessão ativa detectada. Role identificada:", userRole);

      // Temporário: Permitindo visualização na fase de desenvolvimento caso não esteja setado como admin_master
      if (userRole !== 'admin_master') {
        console.warn('Alerta: Você não possui a role admin_master nos metadados do Supabase, mas o acesso está liberado temporariamente para testes visuais.');
      }
      
      setIsAuthorizing(false);
    };

    checkRole();
  }, [router]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      slug: '',
      companyName: '',
      isActive: true,
      logoUrl: '',
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
      templateStyle: 'Corporate',
      assessmentName: '',
      toneOfVoice: 'Consultivo',
      aiModel: 'claude-3-5-sonnet',
    },
  });

  // Apenas simulando o arquivo visualmente, pois a imagem vai pro bucket e preenche o logoUrl
  const [dummyFile, setDummyFile] = useState<File | null>(null);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setDummyFile(e.dataTransfer.files[0]);
      // Mock de URL de bucket:
      setValue('logoUrl', `https://bucket.mockado/logos/${e.dataTransfer.files[0].name}`, { shouldValidate: true });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDummyFile(e.target.files[0]);
      // Mock de URL de bucket:
      setValue('logoUrl', `https://bucket.mockado/logos/${e.target.files[0].name}`, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: ClientFormValues) => {
    setIsSubmittingForm(true);

    try {
      // 1. Montagem do Objeto Mapeável para o Banco de Dados
      const payload = {
        id: data.slug,
        name: data.companyName,
        active: data.isActive,
        branding: {
          logo_url: data.logoUrl || "placeholder",
          primary_color: data.primaryColor,
          secondary_color: data.secondaryColor,
          template_style: data.templateStyle,
        },
        settings: {
          assessment_name: data.assessmentName,
          language: 'pt-BR',
          tone: data.toneOfVoice,
          ai_model: data.aiModel,
        }
      };

      console.log('Enviando Payload para Tabela "clients":', payload);

      // 2. Insert no Supabase
      const { error: insertError } = await supabase
        .from('clients')
        .insert(payload);

      if (insertError) {
        throw insertError;
      }

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Erro ao cadastrar cliente:', err);
      alert('Falha ao cadastrar: ' + err.message);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Se ainda estiver validando o papel, não carrega a form visualmente
  if (isAuthorizing) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">Autorizando Painel Master...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 p-6 md:p-10">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/admin/clients" className="flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Voltar para Clientes
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Novo Cliente White-Label</h1>
          <p className="text-slate-500 mt-1">Configure o ambiente, marca e inteligência de um novo inquilino.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            href="/rh/dashboard"
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center"
          >
            Cancelar
          </Link>
          <button 
            type="submit"
            form="clientForm"
            disabled={isSubmittingForm}
            className={`px-6 py-2.5 text-white font-medium rounded-xl transition-all shadow-md shadow-indigo-200 flex items-center gap-2 ${isSubmittingForm ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            <Save className="w-4 h-4" />
            {isSubmittingForm ? 'Salvando...' : 'Criar Cliente'}
          </button>
        </div>
      </div>

      {/* Alerta de Sucesso */}
      {success && (
        <div className="max-w-6xl mx-auto mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-4 rounded-xl flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="text-emerald-500 w-5 h-5 flex-shrink-0" />
          <p className="font-medium text-sm">Cliente cadastrado com sucesso! A inserção no Supabase ocorreu de forma bem-sucedida.</p>
        </div>
      )}

      {/* Form Container */}
      <form id="clientForm" onSubmit={handleSubmit(onSubmit)} className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        
        {/* Coluna Esquerda: Blocos 1 e 2 */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* BLOCO 1: Informações Básicas */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-5 flex items-center gap-3 bg-slate-50/50">
              <div className="bg-blue-100/80 p-2 rounded-lg">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">1. Informações Básicas</h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Nome da Empresa */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nome da Empresa (Exibição)</label>
                  <input 
                    type="text" 
                    {...register('companyName')}
                    placeholder="Ex: Bisutti Corporate"
                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all ${errors.companyName ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                  />
                  {errors.companyName && <p className="text-red-500 text-xs mt-2 font-medium">{errors.companyName.message}</p>}
                </div>

                {/* Slug / ID */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">ID do Cliente (Slug)</label>
                  <input 
                    type="text" 
                    {...register('slug')}
                    placeholder="ex: bisutti, empresa_abc"
                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-mono text-sm text-slate-600 ${errors.slug ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                  />
                  <p className="text-xs text-slate-400 mt-2">Usado na URL e como Chave Primária.</p>
                  {errors.slug && <p className="text-red-500 text-xs mt-2 font-medium">{errors.slug.message}</p>}
                </div>

                {/* Status Toggle */}
                <div className="flex items-center">
                  <div className="flex flex-col justify-center h-full">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Status da Conta</label>
                    <Controller
                      name="isActive"
                      control={control}
                      render={({ field }) => (
                        <label className="relative inline-flex items-center cursor-pointer mt-1">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                          <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
                          <span className={`ml-3 text-sm font-medium ${field.value ? 'text-emerald-700' : 'text-slate-500'}`}>
                            {field.value ? 'Conta Ativa' : 'Conta Inativa'}
                          </span>
                        </label>
                      )}
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* BLOCO 2: Branding (White-Label) */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-5 flex items-center gap-3 bg-slate-50/50">
              <div className="bg-purple-100/80 p-2 rounded-lg">
                <Palette className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">2. Branding (White-Label)</h2>
            </div>
            
            <div className="p-6 space-y-8">
              
              {/* Upload de Logo Mockado */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Logo do Cliente</label>
                <div 
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <div className="space-y-2 text-center">
                    {dummyFile ? (
                      <div className="flex flex-col items-center">
                        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
                        <div className="mt-4 flex text-sm text-slate-600">
                          <span className="font-semibold text-indigo-600">{dummyFile.name}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Logo pronta para o envio.</p>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="mx-auto h-12 w-12 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                        <div className="flex text-sm text-slate-600 justify-center">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-semibold text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                            <span>Faça upload de um arquivo</span>
                            <input 
                              id="file-upload" 
                              type="file" 
                              className="sr-only" 
                              onChange={handleFileSelect} 
                            />
                          </label>
                          <p className="pl-1">ou arraste e solte aqui</p>
                        </div>
                        <p className="text-xs text-slate-500">Mock para o bucket "logos"</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Cores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Cor Primária (HEX)</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      {...register('primaryColor')}
                      className="h-12 w-14 rounded cursor-pointer border-0 bg-transparent p-0"
                    />
                    <input 
                      type="text" 
                      {...register('primaryColor')}
                      className={`flex-1 px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all uppercase font-mono text-sm text-slate-600 ${errors.primaryColor ? 'border-red-400' : 'border-slate-200'}`}
                    />
                  </div>
                  {errors.primaryColor && <p className="text-red-500 text-xs mt-2 font-medium">{errors.primaryColor.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Cor Secundária (HEX)</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      {...register('secondaryColor')}
                      className="h-12 w-14 rounded cursor-pointer border-0 bg-transparent p-0"
                    />
                    <input 
                      type="text" 
                      {...register('secondaryColor')}
                      className={`flex-1 px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all uppercase font-mono text-sm text-slate-600 ${errors.secondaryColor ? 'border-red-400' : 'border-slate-200'}`}
                    />
                  </div>
                  {errors.secondaryColor && <p className="text-red-500 text-xs mt-2 font-medium">{errors.secondaryColor.message}</p>}
                </div>
              </div>

              {/* Template Style */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Estilo do Template</label>
                <div className="relative">
                  <select 
                    {...register('templateStyle')}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none"
                  >
                    <option value="Corporate">Corporate (Sóbrio & Profissional)</option>
                    <option value="Social">Social (Leve & Interativo)</option>
                    <option value="Clean">Clean (Minimalista)</option>
                    <option value="Tech">Tech (Moderno & Escuro)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <Settings className="w-4 h-4" />
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Coluna Direita: Bloco 3 */}
        <div className="lg:col-span-1">
          
          {/* BLOCO 3: Motor de IA & Regras */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl shadow-lg border border-slate-700 overflow-hidden text-slate-100 flex flex-col h-full">
            <div className="border-b border-slate-700/50 px-6 py-5 flex items-center gap-3">
              <div className="bg-indigo-500/20 p-2 rounded-lg">
                <BrainCircuit className="w-5 h-5 text-indigo-400" />
              </div>
              <h2 className="text-lg font-bold text-white">3. IA & Regras</h2>
            </div>
            
            <div className="p-6 space-y-7 flex-1">
              
              {/* Assessment Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Nome do Assessment</label>
                <input 
                  type="text" 
                  {...register('assessmentName')}
                  placeholder="ex: Mapa de Talentos"
                  className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 border focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 outline-none transition-all text-white placeholder-slate-500 ${errors.assessmentName ? 'border-red-400/50 bg-red-900/10' : 'border-slate-600'}`}
                />
                {errors.assessmentName && <p className="text-red-400 text-xs mt-2 font-medium">{errors.assessmentName.message}</p>}
              </div>

              {/* Tom de Voz */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Tom de Voz da IA</label>
                <div className="relative">
                  <select 
                    {...register('toneOfVoice')}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 outline-none transition-all appearance-none text-white font-medium"
                  >
                    <option value="Consultivo">Consultivo (Equilibrado)</option>
                    <option value="Direto">Direto (Ação & Resultados)</option>
                    <option value="Acolhedor">Acolhedor (Empático)</option>
                    <option value="Técnico">Técnico (Hard Skills Foco)</option>
                  </select>
                </div>
              </div>

              {/* Modelo de IA - Componentes Customizados via Controller para capturar estado visual */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">Modelo Cognitivo Otimizado</label>
                <div className="space-y-3">
                  
                  <Controller
                    name="aiModel"
                    control={control}
                    render={({ field }) => (
                      <>
                        {/* Claude */}
                        <label className={`block p-4 border rounded-xl cursor-pointer transition-all ${field.value === 'claude-3-5-sonnet' ? 'bg-indigo-900/40 border-indigo-500 shadow-inner' : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600/80 hover:bg-slate-800/50'}`}>
                          <div className="flex items-start gap-3">
                            <input 
                              type="radio" 
                              value="claude-3-5-sonnet"
                              checked={field.value === 'claude-3-5-sonnet'}
                              onChange={(e) => field.onChange(e.target.value)}
                              className="mt-1 flex-shrink-0 text-indigo-500 focus:ring-indigo-500/50 bg-slate-900 border-slate-600"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <Bot className="w-4 h-4 text-orange-400" />
                                <span className="font-semibold text-sm">Claude 3.5 Sonnet</span>
                              </div>
                              <p className="text-xs text-slate-400 mt-1 leading-snug">Otimizado para área de RH e Psicologia, gera relatórios profundos.</p>
                            </div>
                          </div>
                        </label>

                        {/* GPT-4o */}
                        <label className={`block p-4 border rounded-xl cursor-pointer transition-all ${field.value === 'gpt-4o' ? 'bg-indigo-900/40 border-indigo-500 shadow-inner' : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600/80 hover:bg-slate-800/50'}`}>
                          <div className="flex items-start gap-3">
                            <input 
                              type="radio" 
                              value="gpt-4o"
                              checked={field.value === 'gpt-4o'}
                              onChange={(e) => field.onChange(e.target.value)}
                              className="mt-1 flex-shrink-0 text-indigo-500 focus:ring-indigo-500/50 bg-slate-900 border-slate-600"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <Bot className="w-4 h-4 text-emerald-400" />
                                <span className="font-semibold text-sm">OpenAI GPT-4o</span>
                              </div>
                              <p className="text-xs text-slate-400 mt-1 leading-snug">Alta performance e velocidade incrível em multitarefa.</p>
                            </div>
                          </div>
                        </label>

                        {/* Gemini */}
                        <label className={`block p-4 border rounded-xl cursor-pointer transition-all ${field.value === 'gemini-1-5-flash' ? 'bg-indigo-900/40 border-indigo-500 shadow-inner' : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600/80 hover:bg-slate-800/50'}`}>
                          <div className="flex items-start gap-3">
                            <input 
                              type="radio" 
                              value="gemini-1-5-flash"
                              checked={field.value === 'gemini-1-5-flash'}
                              onChange={(e) => field.onChange(e.target.value)}
                              className="mt-1 flex-shrink-0 text-indigo-500 focus:ring-indigo-500/50 bg-slate-900 border-slate-600"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <Bot className="w-4 h-4 text-blue-400" />
                                <span className="font-semibold text-sm">Gemini 1.5 Flash</span>
                              </div>
                              <p className="text-xs text-slate-400 mt-1 leading-snug">Ótimo custo-benefício para alto volume de disparos simultâneos.</p>
                            </div>
                          </div>
                        </label>
                      </>
                    )}
                  />
                </div>
              </div>

            </div>
          </div>
          
        </div>

      </form>
    </div>
  );
}
