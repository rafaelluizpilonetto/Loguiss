import { DIAS_HISTORICO_ENVIADO, MAX_MOVIMENTACOES_PREVISAO } from './constantes.js';

/**
 * Prompts enviados à IA. Ficam separados da lógica para você ajustar o texto
 * sem mexer no service.
 *
 * São DUAS chamadas por previsão:
 *   1) CONTEXTO: a IA pesquisa na web eventos, feriados e sazonalidade.
 *   2) PREVISÃO: com o contexto pronto, a IA calcula a previsão dos produtos
 *      (sem pesquisar de novo, o que deixa mais barato e mais estável).
 */

// ---------------------------------------------------------------
// 1) CONTEXTO (com busca na web)
// ---------------------------------------------------------------
export const SYSTEM_CONTEXTO = `Você é um analista de varejo brasileiro especializado em micro e pequenas empresas.
Pesquise o que pode afetar a demanda no período e local informados: feriados, datas comerciais, eventos locais, férias escolares, clima e sazonalidade do segmento.

Regras:
- Faça no máximo 3 buscas e use fontes confiáveis.
- Inclua eventos do período ou que terminem pouco antes dele e ainda afetem a demanda.
- Não invente datas; marque "confirmado": false se não puder confirmar.
- Liste até 6 eventos relevantes e até 3 fontes.
- Responda somente com JSON válido, sem markdown ou texto extra.

Formato obrigatório:
{
  "eventos": [
    {
      "nome": "string",
      "data_inicio": "AAAA-MM-DD",
      "data_fim": "AAAA-MM-DD",
      "tipo": "feriado | comercial | local | escolar | clima | outro",
      "impacto": "alto | medio | baixo",
      "categorias_afetadas": ["string"],
      "confirmado": true,
      "observacao": "string curta explicando o efeito esperado na demanda"
    }
  ],
  "sazonalidade": "resumo de uma frase sobre época do ano e efeito no segmento",
  "fontes": ["https://..."]
}`;

export function montarMensagemContexto({
  dataReferencia,
  dataInicio,
  dataFim,
  horizonteDias,
  localizacao,
  segmento,
  categorias,
}) {
  return [
    `Data de hoje: ${dataReferencia}.`,
    `Período a analisar: de ${dataInicio} a ${dataFim} (${horizonteDias} dias).`,
    `Localização da empresa: ${localizacao}.`,
    `Segmento da empresa: ${segmento}.`,
    `Categorias de produtos vendidos: ${categorias.length ? categorias.join(', ') : 'não informadas'}.`,
    '',
    'Pesquise e responda com o JSON no formato combinado.',
  ].join('\n');
}

// ---------------------------------------------------------------
// 2) PREVISÃO (sem busca na web)
// ---------------------------------------------------------------
export const SYSTEM_PREVISAO = `Você é um analista de demanda para micro e pequenas empresas brasileiras.
Preveja as saídas diárias usando contexto, estoque e JSON de entrada.
Chaves: ref=data de referência; inicio/fim=datas previstas; dias=horizonte; contexto contém eventos e sazonalidade. Cada produto usa id, nome, cat=categoria, un=unidade, frac=fracionado, est=estoque atual, seg=estoque seguro, lead=prazo de reposição, m7/m30=médias diárias, t=tendência percentual, d=dias com saída nos últimos 30 dias, hist.i/hist.q=saídas diárias consecutivas e mov=até 40 movimentações recentes dos produtos enviados (data, tipo e quantidade).

Regras: considere médias, tendência, dia da semana e eventos. Sem histórico suficiente, reduza a confiança e explique. Não invente eventos nem quantidades negativas. Retorne todos os produtos recebidos, usando o mesmo id e exatamente dias quantidades, começando em inicio. frac=true permite decimais; caso contrário, use inteiros. Confiança entre 0 e 1. Justificativa em até 2 frases curtas. Gere no máximo 2 alertas relevantes por produto; use urgente só para risco real de ruptura e cite números.
Responda somente com JSON válido, sem markdown ou texto extra, neste formato:
{
  "horizonte_dias": 14,
  "produtos": [
    {
      "id_produto": 1,
      "quantidades_por_dia": [0, 0, 0],
      "confianca": 0.8,
      "justificativa": "string"
    }
  ],
  "alertas": [
    {
      "id_produto": 1,
      "severidade": "urgente | atencao | informativo",
      "titulo": "string curto",
      "descricao": "string"
    }
  ]
}`;

export function montarMensagemPrevisao({
  dataReferencia,
  dataInicioPrevisao,
  dataFimPrevisao,
  horizonteDias,
  contexto,
  produtos,
}) {
  function somarDias(data, quantidade) {
    const dataObj = new Date(`${data}T00:00:00Z`);
    dataObj.setUTCDate(dataObj.getUTCDate() + quantidade);
    return dataObj.toISOString().slice(0, 10);
  }

  const eventosEnxutos = (Array.isArray(contexto?.eventos) ? contexto.eventos : [])
    .filter((e) => e?.confirmado !== false)
    .slice(0, 6)
    .map((e) => ({
      nome: e.nome,
      inicio: e.data_inicio,
      fim: e.data_fim,
      impacto: e.impacto,
      obs: e.observacao ? String(e.observacao).slice(0, 80) : undefined,
    }));

  let movimentacoesRestantes = MAX_MOVIMENTACOES_PREVISAO;
  const limitePorProduto = Math.max(
    1,
    Math.ceil(MAX_MOVIMENTACOES_PREVISAO / Math.max(produtos.length, 1)),
  );

  const produtosEnxutos = produtos.map((p) => {
    const historico = p.historico_saidas.quantidades_por_dia;
    const inicio = Math.max(0, historico.length - DIAS_HISTORICO_ENVIADO);
    const quantidadePermitida = Math.min(
      limitePorProduto,
      movimentacoesRestantes,
    );
    const movimentacoes = (p.movimentacoes_recentes ?? [])
      .slice(0, quantidadePermitida);
    return {
      id: p.id_produto,
      nome: String(p.nome).slice(0, 80),
      cat: String(p.categoria ?? '').slice(0, 40),
      un: String(p.unidade ?? '').slice(0, 16),
      frac: p.fracionado,
      est: p.estoque_atual,
      seg: p.estoque_seguro,
      lead: p.prazo_reposicao_dias,
      m7: p.estatisticas.media_dia_7,
      m30: p.estatisticas.media_dia_30,
      t: p.estatisticas.tendencia_percentual,
      d: p.estatisticas.dias_com_saida,
      hist: {
        i: somarDias(p.historico_saidas.data_inicial, inicio),
        q: historico.slice(inicio).map((q) => Number(Number(q).toFixed(2))),
      },
      mov: movimentacoes.map((movimento) => ({
        data: movimento.data,
        tipo: String(movimento.tipo).slice(0, 16),
        q: Number(Number(movimento.quantidade).toFixed(2)),
      })),
    };
  });

  return JSON.stringify({
    ref: dataReferencia,
    inicio: dataInicioPrevisao,
    fim: dataFimPrevisao,
    dias: horizonteDias,
    contexto: {
      eventos: eventosEnxutos,
      sazonalidade: contexto?.sazonalidade ? String(contexto.sazonalidade).slice(0, 160) : '',
    },
    produtos: produtosEnxutos,
  });
}

export default {
  SYSTEM_CONTEXTO,
  SYSTEM_PREVISAO,
  montarMensagemContexto,
  montarMensagemPrevisao,
};