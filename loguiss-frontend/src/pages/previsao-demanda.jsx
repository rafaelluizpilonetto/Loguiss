import { CalendarClock, ChartColumn, Package, RefreshCw, TriangleAlert } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '../components/button';
import { StatCard } from '../components/card';
import { AlertasIA } from '../components/indicators/alertas-ia';
import { HistoricoMovimentacoes } from '../components/indicators/historico-movimentacoes';
import { PrevisaoDemandasIA } from '../components/indicators/previsao-demandas-ia';
import { PrevisaoSaida } from '../components/indicators/previsao-venda';
import { RecomendacoesCompra } from '../components/indicators/recomendacao-compra';
import { SideBar } from '../components/sidebar';
import api from '../services/api';

function formatarNumero(valor, casas = 2) {
    if (valor === null || valor === undefined || !Number.isFinite(Number(valor))) return '—';
    return Number(valor).toLocaleString('pt-BR', {
        maximumFractionDigits: casas,
    });
}

function PrevisaoDemanda() {
    const [previsao, setPrevisao] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [gerando, setGerando] = useState(false);

    useEffect(() => {
        let ativo = true;

        async function carregarPrevisao() {
            try {
                const resposta = await api.get('/previsao/ultima');
                if (ativo) setPrevisao(resposta.data);
            } catch (error) {
                if (error.response?.status !== 404 && ativo) {
                    toast.error(error.response?.data?.erro || 'Não foi possível carregar a previsão.');
                }
            } finally {
                if (ativo) setCarregando(false);
            }
        }

        carregarPrevisao();
        return () => {
            ativo = false;
        };
    }, []);

    async function gerarPrevisao() {
        setGerando(true);
        try {
            const resposta = await api.post('/previsao', {});
            setPrevisao(resposta.data);
            toast.success('Previsão atualizada com sucesso.');
        } catch (error) {
            toast.error(error.response?.data?.erro || 'Não foi possível gerar a previsão.');
        } finally {
            setGerando(false);
        }
    }

    const dadosIA = previsao?.dadosIA ?? [];
    const seriesIA = previsao?.seriesIA ?? [];
    const saidas = previsao?.dadosSaida ?? [];
    const recomendacoes = previsao?.recomendacoesCompra ?? [];
    const produtosPrevisao = previsao?.produtosPrevisao ?? [];
    const alertas = previsao?.alertas ?? [];
    const movimentacoes = previsao?.movimentacoes ?? [];
    const modelo = previsao?.previsao?.modelo;
    const horizonteDias = Number(previsao?.previsao?.horizonteDias ?? 0);
    const previsaoIncompleta =
        Boolean(previsao) && horizonteDias > 0 && dadosIA.length < horizonteDias;
    const usaProjecaoLocal = modelo?.includes('local') ?? false;
    const produtosEmRisco = recomendacoes.filter((produto) => produto.urgente).length;

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
            <SideBar />
            <main className="ml-72 min-h-screen p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="mt-2 mb-2 text-3xl font-bold">Previsão de Demandas</h1>
                        <p className="text-gray-400">
                            Consulte a previsão mais recente ou gere uma nova análise do estoque.
                        </p>
                        {previsao?.previsao && (
                            <p className="mt-2 text-xs text-gray-400">
                                Atualizada em{' '}
                                {new Date(previsao.previsao.geradoEm).toLocaleString('pt-BR')} ·
                                modelo {previsao.previsao.modelo}
                            </p>
                        )}
                        {previsaoIncompleta && (
                            <p className="mt-2 text-xs text-amber-400" role="status">
                                A última previsão contém {dadosIA.length} de {horizonteDias} dias.
                                Clique em “Gerar previsão” para criar uma série completa para os
                                gráficos.
                            </p>
                        )}
                    </div>
                    <Button
                        type="button"
                        onClick={gerarPrevisao}
                        disabled={gerando || carregando}
                        className="flex items-center gap-2"
                    >
                        <RefreshCw size={16} className={gerando ? 'animate-spin' : ''} />
                        {gerando ? 'Gerando previsão...' : 'Gerar previsão'}
                    </Button>
                </div>

                {carregando ? (
                    <p className="mt-8 text-sm text-gray-400" role="status">
                        Carregando previsão...
                    </p>
                ) : previsao ? (
                    <>
                        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            <StatCard
                                titulo="Produtos Monitorados"
                                valor={seriesIA.length}
                                icone={Package}
                                subDescricao="Incluídos nesta previsão"
                                tituloClassName="text-sm"
                            />
                            <StatCard
                                titulo="Produtos em risco"
                                valor={produtosEmRisco}
                                icone={TriangleAlert}
                                subDescricao="Com risco de ruptura"
                            />
                            <StatCard
                                titulo="Reposição"
                                valor={previsao.diasParaProximaReposicao ?? '--'}
                                descricao={previsao.diasParaProximaReposicao === null ? '' : 'dias'}
                                icone={CalendarClock}
                                subDescricao="Menor prazo recomendado"
                            />
                            <StatCard
                                titulo="Alertas"
                                valor={alertas.length}
                                icone={ChartColumn}
                                subDescricao="Da previsão mais recente"
                            />
                        </div>

                        <div className="mb-3 grid grid-cols-1 gap-3 xl:grid-cols-2">
                            <PrevisaoDemandasIA
                                titulo="Demanda prevista por dia"
                                descricao="Quantidades diárias da previsão salva, por produto"
                                dados={dadosIA}
                                series={seriesIA}
                            />
                            <PrevisaoSaida
                                dias={horizonteDias || 14}
                                dados={saidas}
                            />
                        </div>
                        <section className="mt-4 rounded-xl border border-borda bg-superficie p-5">
                            <h2 className="text-base font-bold text-texto">
                                Detalhamento salvo por produto
                            </h2>
                            <p className="mt-1 text-xs text-texto-suave">
                                Projeção, confiança e justificativa registradas para cada produto.
                            </p>
                            <div className="mt-4 overflow-x-auto">
                                <table className="w-full min-w-[760px] border-collapse text-left">
                                    <thead>
                                        <tr className="border-b border-borda text-[11px] font-semibold uppercase tracking-wider text-texto-suave">
                                            <th className="pb-3 pr-4">Produto</th>
                                            <th className="px-3 pb-3 text-right">Previsto</th>
                                            <th className="px-3 pb-3 text-right">Média/dia</th>
                                            <th className="px-3 pb-3 text-right">Confiança</th>
                                            <th className="px-3 pb-3">Justificativa</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-borda">
                                        {produtosPrevisao.map((produto) => (
                                            <tr key={produto.id}>
                                                <td className="py-3 pr-4">
                                                    <div className="text-sm font-semibold text-texto">
                                                        {produto.nome}
                                                    </div>
                                                    <div className="text-xs text-texto-suave">
                                                        {produto.codigo} · {produto.unidade}
                                                    </div>
                                                </td>
                                                <td className="px-3 py-3 text-right text-sm text-texto">
                                                    {formatarNumero(produto.totalPrevisto)}{' '}
                                                    {produto.unidade}
                                                </td>
                                                <td className="px-3 py-3 text-right text-sm text-texto">
                                                    {formatarNumero(produto.mediaDia)}{' '}
                                                    {produto.unidade}/dia
                                                </td>
                                                <td className="px-3 py-3 text-right text-sm text-texto">
                                                    {produto.confianca === null ||
                                                    produto.confianca === undefined
                                                        ? '—'
                                                        : `${formatarNumero(
                                                              produto.confianca * 100,
                                                              0,
                                                          )}%`}
                                                </td>
                                                <td className="px-3 py-3 text-sm text-texto-suave">
                                                    {produto.justificativa || 'Sem justificativa.'}
                                                </td>
                                            </tr>
                                        ))}
                                        {produtosPrevisao.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="py-4 text-sm text-texto-suave"
                                                >
                                                    Esta previsão não possui detalhamento por
                                                    produto salvo.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                        <RecomendacoesCompra dados={recomendacoes} />
                        <div className="mt-1 grid grid-cols-1 gap-3 xl:grid-cols-2">
                            <HistoricoMovimentacoes
                                dados={movimentacoes}
                                badgeRodape="Movimentações recentes"
                            />
                            <AlertasIA dados={alertas} />
                        </div>
                    </>
                ) : (
                    <div className="mt-6 rounded-xl border border-borda bg-superficie p-6 text-sm text-texto-suave">
                        Ainda não há uma previsão completa salva. Gere uma nova previsão para
                        carregar os gráficos, recomendações e alertas.
                    </div>
                )}
            </main>
        </div>
    );
}

export default PrevisaoDemanda;
