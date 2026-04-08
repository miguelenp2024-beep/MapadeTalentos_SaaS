import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai'; // Continuamos usando o pacote 'openai', mas apontando pro OpenRouter!

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// Inicialização Mágica: Pacote da OpenAI apontando para o OpenRouter
const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY, // Sua chave do OpenRouter no .env
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000", 
    "X-Title": "SaaS Mapa de Talentos", 
  }
});

export async function POST(request: Request) {
  try {
    const { participantId, clientId, isGestor } = await request.json();

    // 1. Buscar os Dados do Participante + Guia de Cargo
    const { data: participant, error: partError } = await supabase
      .from('participants')
      .select('*, cargo_guides(*)')
      .eq('id', participantId)
      .single();

    if (partError || !participant) throw new Error('Participante não encontrado.');

    // 2. Buscar as Configurações do Cliente (Onde definimos qual IA usar!)
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('settings')
      .eq('id', clientId)
      .single();

    // O pulo do gato: Pega o modelo do banco ou usa um fallback seguro
    // Ex: "anthropic/claude-3.5-sonnet" ou "openai/gpt-4o"
    const aiModel = client?.settings?.ai_model || "anthropic/claude-3.5-sonnet";

    // 3. Buscar a Regra da IA (System Prompt)
    const { data: rule } = await supabase
      .from('methodology_ai_rules')
      .select('system_prompt')
      .eq('id', 'prompt_master_relatorio')
      .single();

    // 4. Montar o User Prompt (Cruzamento de dados)
    const cargo = participant.cargo_guides;
    const focusTalents = participant.focus3.join(', ');
    const fortes = [];
    for (const cat in participant.talents) {
        fortes.push(...participant.talents[cat].filter((t: any) => t.score >= 5).map((t: any) => t.nome));
    }

    const userPrompt = `
      DADOS DO PARTICIPANTE:
      Nome: ${participant.name}
      Cargo Atual/Alvo: ${participant.role_label}
      Talentos Fortes: ${fortes.join(', ')}.
      Focos de Desenvolvimento: ${focusTalents}.

      CONTEXTO DO CARGO:
      ${cargo ? JSON.stringify(cargo.context) : 'Contexto não definido.'}
      
      EIXOS CRÍTICOS:
      ${cargo ? JSON.stringify(cargo.axes_ranking.filter((a:any) => a.nivel === 'Crítico' || a.nivel === 'Alta')) : 'Não definidos.'}

      INSTRUÇÕES EXTRAS:
      - O usuário é um ${isGestor ? 'Gestor (gere recomendacao_pessoal)' : 'Colaborador (retorne null)'}.
    `;

    // 5. Chamar o OpenRouter (Dinâmico)
    const completion = await openrouter.chat.completions.create({
      model: aiModel, // <- AQUI ENTRA O MODELO ESCOLHIDO NO BANCO!
      response_format: { type: "json_object" }, // OpenRouter repassa isso pro Claude/GPT
      messages: [
        { role: "system", content: rule!.system_prompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
    });

    const aiResponseContent = completion.choices[0].message.content;
    const generatedNarrative = JSON.parse(aiResponseContent!);

    // 6. Salvar de volta no Supabase
    await supabase
      .from('participants')
      .update({ 
        narrative: generatedNarrative,
        narrative_generated_at: new Date().toISOString(),
        model_used: aiModel // Salva qual modelo gerou esse laudo para auditoria!
      })
      .eq('id', participantId);

    return NextResponse.json({ success: true, data: generatedNarrative });

  } catch (error: any) {
    console.error('Erro na geração:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}