'use client';

import React, { useState } from 'react';
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

export default function NewClientPage() {
  const [formData, setFormData] = useState({
    // Bloco 1: Básicos
    slug: '',
    companyName: '',
    isActive: true,

    // Bloco 2: Branding
    logoFile: null as File | null,
    primaryColor: '#3B82F6',   // Default blue
    secondaryColor: '#10B981', // Default emerald
    templateStyle: 'Corporate',

    // Bloco 3: IA & Regras
    assessmentName: '',
    toneOfVoice: 'Consultivo',
    aiModel: 'claude-3-5-sonnet',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData(prev => ({ ...prev, logoFile: e.dataTransfer.files[0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Salvando Cliente: ', formData);
    // Aqui viria a lógica do Supabase e Storage
    alert('Cliente cadastrado com sucesso (Demo)!');
  };

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
          <button 
            type="button"
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-all shadow-sm"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Criar Cliente
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Coluna Esquerda: Blocos 1 e 2 */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* BLOCO 1: Informações Básicas */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-5 flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-lg">
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
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Ex: Bisutti Corporate"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>

                {/* Slug / ID */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">ID do Cliente (Slug)</label>
                  <input 
                    type="text" 
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="ex: bisutti, empresa_abc"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-mono text-sm text-slate-600"
                  />
                  <p className="text-xs text-slate-400 mt-2">Usado na URL e como Chave Primária.</p>
                </div>

                {/* Status Toggle */}
                <div className="flex items-center">
                  <div className="flex flex-col justify-center h-full">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Status da Conta</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="sr-only peer" 
                      />
                      <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
                      <span className="ml-3 text-sm font-medium text-slate-700">
                        {formData.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </label>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* BLOCO 2: Branding (White-Label) */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-5 flex items-center gap-3">
              <div className="bg-purple-50 p-2 rounded-lg">
                <Palette className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">2. Branding (White-Label)</h2>
            </div>
            
            <div className="p-6 space-y-8">
              
              {/* Upload de Logo */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Logo do Cliente</label>
                <div 
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <div className="space-y-2 text-center">
                    {formData.logoFile ? (
                      <div className="flex flex-col items-center">
                        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
                        <div className="mt-4 flex text-sm text-slate-600">
                          <span className="font-semibold text-indigo-600">{formData.logoFile.name}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Pronto para upload.</p>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="mx-auto h-12 w-12 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                        <div className="flex text-sm text-slate-600 justify-center">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-semibold text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                            <span>Faça upload de um arquivo</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setFormData(prev => ({ ...prev, logoFile: e.target.files![0] }));
                              }
                            }} />
                          </label>
                          <p className="pl-1">ou arraste e solte aqui</p>
                        </div>
                        <p className="text-xs text-slate-500">PNG, JPG, SVG até 2MB</p>
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
                      name="primaryColor"
                      value={formData.primaryColor}
                      onChange={handleInputChange}
                      className="h-12 w-14 rounded cursor-pointer border-0 bg-transparent p-0"
                    />
                    <input 
                      type="text" 
                      name="primaryColor"
                      value={formData.primaryColor}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all uppercase font-mono text-sm text-slate-600"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Cor Secundária (HEX)</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      name="secondaryColor"
                      value={formData.secondaryColor}
                      onChange={handleInputChange}
                      className="h-12 w-14 rounded cursor-pointer border-0 bg-transparent p-0"
                    />
                    <input 
                      type="text" 
                      name="secondaryColor"
                      value={formData.secondaryColor}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all uppercase font-mono text-sm text-slate-600"
                    />
                  </div>
                </div>
              </div>

              {/* Template Style */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Estilo do Template</label>
                <div className="relative">
                  <select 
                    name="templateStyle"
                    value={formData.templateStyle}
                    onChange={handleInputChange}
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
          <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl shadow-lg border border-slate-700 overflow-hidden text-slate-100">
            <div className="border-b border-slate-700/50 px-6 py-5 flex items-center gap-3">
              <div className="bg-indigo-500/20 p-2 rounded-lg">
                <BrainCircuit className="w-5 h-5 text-indigo-400" />
              </div>
              <h2 className="text-lg font-bold text-white">3. Motor de IA & Regras</h2>
            </div>
            
            <div className="p-6 space-y-6">
              
              {/* Assessment Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Nome do Assessment</label>
                <input 
                  type="text" 
                  name="assessmentName"
                  value={formData.assessmentName}
                  onChange={handleInputChange}
                  placeholder="ex: Mapa de Talentos"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 outline-none transition-all text-white placeholder-slate-500"
                />
              </div>

              {/* Tom de Voz */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Tom de Voz da IA</label>
                <div className="relative">
                  <select 
                    name="toneOfVoice"
                    value={formData.toneOfVoice}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 outline-none transition-all appearance-none text-white"
                  >
                    <option value="Consultivo">Consultivo (Equilibrado)</option>
                    <option value="Direto">Direto (Orientado a Resultados)</option>
                    <option value="Acolhedor">Acolhedor (Empático & Suave)</option>
                    <option value="Técnico">Técnico (Foco em Hard Skills)</option>
                  </select>
                </div>
              </div>

              {/* Modelo de IA */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Modelo de Inteligência Artificial</label>
                <div className="space-y-3">
                  
                  {/* Claude */}
                  <label className={`block p-4 border rounded-xl cursor-pointer transition-all ${formData.aiModel === 'claude-3-5-sonnet' ? 'bg-indigo-900/40 border-indigo-500 shadow-inner' : 'bg-slate-800/30 border-slate-700 hover:border-slate-500'}`}>
                    <div className="flex items-start gap-3">
                      <input 
                        type="radio" 
                        name="aiModel"
                        value="claude-3-5-sonnet"
                        checked={formData.aiModel === 'claude-3-5-sonnet'}
                        onChange={handleInputChange}
                        className="mt-1 h-4 w-4 text-indigo-500 bg-slate-700 border-slate-500 focus:ring-indigo-500"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4 text-orange-400" />
                          <span className="font-semibold text-sm">Anthropic Claude 3.5 Sonnet</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Recomendado para RH e análises profundas.</p>
                      </div>
                    </div>
                  </label>

                  {/* GPT-4o */}
                  <label className={`block p-4 border rounded-xl cursor-pointer transition-all ${formData.aiModel === 'gpt-4o' ? 'bg-indigo-900/40 border-indigo-500 shadow-inner' : 'bg-slate-800/30 border-slate-700 hover:border-slate-500'}`}>
                    <div className="flex items-start gap-3">
                      <input 
                        type="radio" 
                        name="aiModel"
                        value="gpt-4o"
                        checked={formData.aiModel === 'gpt-4o'}
                        onChange={handleInputChange}
                        className="mt-1 h-4 w-4 text-indigo-500 bg-slate-700 border-slate-500 focus:ring-indigo-500"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4 text-emerald-400" />
                          <span className="font-semibold text-sm">OpenAI GPT-4o</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Alta performance e velocidade.</p>
                      </div>
                    </div>
                  </label>

                  {/* Gemini 1.5 Flash */}
                  <label className={`block p-4 border rounded-xl cursor-pointer transition-all ${formData.aiModel === 'gemini-1-5-flash' ? 'bg-indigo-900/40 border-indigo-500 shadow-inner' : 'bg-slate-800/30 border-slate-700 hover:border-slate-500'}`}>
                    <div className="flex items-start gap-3">
                      <input 
                        type="radio" 
                        name="aiModel"
                        value="gemini-1-5-flash"
                        checked={formData.aiModel === 'gemini-1-5-flash'}
                        onChange={handleInputChange}
                        className="mt-1 h-4 w-4 text-indigo-500 bg-slate-700 border-slate-500 focus:ring-indigo-500"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4 text-blue-400" />
                          <span className="font-semibold text-sm">Google Gemini 1.5 Flash</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Custo-benefício para alto volume.</p>
                      </div>
                    </div>
                  </label>

                </div>
              </div>

            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}
