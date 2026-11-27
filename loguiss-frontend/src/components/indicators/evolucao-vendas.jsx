import { useEffect, useMemo, useState } from 'react';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import { corGrafico, estiloTooltip } from '../../utils/graficos';

const DADOS_EVOLUCAO_VAZIOS = { mensal: {}, anual: {} };

const ORDEM_MESES = {
    jan: 1, janeiro: 1,
    fev: 2, fevereiro: 2,
    mar: 3, março: 3, marco: 3,
    abr: 4, abril: 4,
    mai: 5, maio: 5,
    jun: 6, junho: 6,
    jul: 7, julho: 7,
    ago: 8, agosto: 8,
    set: 9, setembro: 9,
    out: 10, outubro: 10,
    nov: 11, novembro: 11,
    dez: 12, dezembro: 12,
};

function limitarCasasDecimais(valor, casas = 2) {
    const limite = Math.max(0, Math.min(6, Number.isFinite(Number(casas)) ? Number(casas) : 2));
    const numero = Number(valor);
    if (!Number.isFinite(numero)) return 0;
    return Number(numero.toFixed(limite));
}

function obterDiasDoMes(chavePeriodo) {
    const match = String(chavePeriodo || '').trim().match(/^(\d{4})-(\d{2})$/);
    if (!match) return 31;
    const ano = Number(match[1]);
    const mes = Number(match[2]);
    return new Date(ano, mes, 0).getDate();
}

function normalizarDia(valorPeriodo) {
    const texto = String(valorPeriodo ?? '').trim();
    const matchDataCompleta = texto.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (matchDataCompleta) {
        return matchDataCompleta[3];
    }
    return texto.padStart(2, '0');
}

function formatarRotuloMensal(chave) {
    if (!chave) return '';
    const texto = String(chave).trim();
    if (/^\d{4}-\d{2}$/.test(texto)) {
        const data = new Date(`${texto}-02T12:00:00`);
        if (!Number.isNaN(data.getTime())) {
            return data.toLocaleDateString('pt-BR', {
                month: 'long',
                year: 'numeric',
            });
        }
    }
    return texto;
}

function ordenarPeriodos(a, b) {
    const numA = Number(a);
    const numB = Number(b);
    if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
        return numA - numB;
    }

    const mesA = ORDEM_MESES[String(a).trim().toLowerCase()];
    const mesB = ORDEM_MESES[String(b).trim().toLowerCase()];
    if (mesA && mesB) {
        return mesA - mesB;
    }

    return String(a).localeCompare(String(b), 'pt-BR');
}

export function EvolucaoVendas({
    dadosEvolucao = DADOS_EVOLUCAO_VAZIOS,
    casasDecimais = 2,
}) {
    const base = dadosEvolucao || DADOS_EVOLUCAO_VAZIOS;

    const chavesMensal = useMemo(
        () => Object.keys(base.mensal || {}).sort(),
        [base.mensal],
    );
    const chavesAnual = useMemo(
        () => Object.keys(base.anual || {}).sort(),
        [base.anual],
    );

    const [visualizacao, setVisualizacao] = useState('mensal');
    const [periodo1, setPeriodo1] = useState(() => chavesMensal[0] || '');
    const [periodo2, setPeriodo2] = useState(
        () => chavesMensal[1] || chavesMensal[0] || '',
    );

    useEffect(() => {
        const chaves = visualizacao === 'mensal' ? chavesMensal : chavesAnual;
        if (!chaves.length) return;

        if (!chaves.includes(periodo1)) {
            setPeriodo1(chaves[0]);
        }
        if (!chaves.includes(periodo2)) {
            setPeriodo2(chaves[1] || chaves[0]);
        }
    }, [visualizacao, chavesMensal, chavesAnual, periodo1, periodo2]);

    const dados = useMemo(() => {
        const mapa = base[visualizacao] || {};
        const lista1 = Array.isArray(mapa[periodo1]) ? mapa[periodo1] : [];
        const lista2 = Array.isArray(mapa[periodo2]) ? mapa[periodo2] : [];

        const formatarChave =
            visualizacao === 'mensal'
                ? (p) => normalizarDia(p)
                : (p) => String(p).trim();

        const map1 = new Map(
            lista1
                .filter((item) => item && item.periodo !== undefined && item.periodo !== null)
                .map((item) => [
                    formatarChave(item.periodo),
                    limitarCasasDecimais(item.vendas, casasDecimais),
                ]),
        );
        const map2 = new Map(
            lista2
                .filter((item) => item && item.periodo !== undefined && item.periodo !== null)
                .map((item) => [
                    formatarChave(item.periodo),
                    limitarCasasDecimais(item.vendas, casasDecimais),
                ]),
        );

        if (visualizacao === 'mensal') {
            const totalDias = Math.max(
                obterDiasDoMes(periodo1),
                obterDiasDoMes(periodo2),
            );

            return Array.from({ length: totalDias }, (_, idx) => {
                const dia = String(idx + 1).padStart(2, '0');
                return {
                    periodo: dia,
                    periodo1: map1.get(dia) ?? 0,
                    periodo2: map2.get(dia) ?? 0,
                };
            });
        }

        const todosPeriodos = Array.from(new Set([...map1.keys(), ...map2.keys()])).sort(
            ordenarPeriodos,
        );

        return todosPeriodos.map((periodo) => ({
            periodo,
            periodo1: map1.get(periodo) ?? 0,
            periodo2: map2.get(periodo) ?? 0,
        }));
    }, [base, visualizacao, periodo1, periodo2, casasDecimais]);

    const formatarMoeda = (valor) => {
        const limite = Math.max(
            0,
            Math.min(6, Number.isFinite(Number(casasDecimais)) ? Number(casasDecimais) : 2),
        );
        const normalizado = limitarCasasDecimais(valor, limite);

        return normalizado.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: limite,
            maximumFractionDigits: limite,
        });
    };

    const chavesAtuais = visualizacao === 'mensal' ? chavesMensal : chavesAnual;
    const nomeLinha1 =
        visualizacao === 'mensal'
            ? formatarRotuloMensal(periodo1) || 'Primeiro período'
            : periodo1 || 'Primeiro período';
    const nomeLinha2 =
        visualizacao === 'mensal'
            ? formatarRotuloMensal(periodo2) || 'Segundo período'
            : periodo2 || 'Segundo período';

    const cor1 = corGrafico?.primaria || '#A3E635';
    const cor2 = corGrafico?.aviso || '#F59E0B';

    return (
        <div className="w-full min-w-0 rounded-xl border border-borda bg-superficie p-5">
            <div className="mb-5">
                <h2 className="text-xl font-bold text-texto">Evolução de vendas</h2>

                <p className="mt-1 text-sm text-texto-suave">
                    Compare o desempenho de vendas entre períodos.
                </p>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                    <label className="mb-2 block text-sm text-texto-suave">Visualização</label>

                    <select
                        value={visualizacao}
                        onChange={(e) => {
                            const novaVisualizacao = e.target.value;
                            const novasChaves =
                                novaVisualizacao === 'mensal' ? chavesMensal : chavesAnual;

                            setVisualizacao(novaVisualizacao);
                            setPeriodo1(novasChaves[0] || '');
                            setPeriodo2(novasChaves[1] || novasChaves[0] || '');
                        }}
                        className="w-full rounded-lg border border-borda bg-elevada p-3 text-texto outline-none transition-colors focus:border-primaria focus:ring-1 focus:ring-primaria/30 [&>option]:bg-superficie"
                    >
                        <option value="mensal">Mensal</option>
                        <option value="anual">Anual</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm text-texto-suave">Primeiro período</label>

                    <select
                        value={periodo1}
                        onChange={(e) => setPeriodo1(e.target.value)}
                        className="w-full rounded-lg border border-borda bg-elevada p-3 text-texto outline-none transition-colors focus:border-primaria focus:ring-1 focus:ring-primaria/30 [&>option]:bg-superficie"
                    >
                        {chavesAtuais.map((periodo) => (
                            <option key={periodo} value={periodo}>
                                {visualizacao === 'mensal'
                                    ? formatarRotuloMensal(periodo)
                                    : periodo}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm text-texto-suave">Segundo período</label>

                    <select
                        value={periodo2}
                        onChange={(e) => setPeriodo2(e.target.value)}
                        className="w-full rounded-lg border border-borda bg-elevada p-3 text-texto outline-none transition-colors focus:border-primaria focus:ring-1 focus:ring-primaria/30 [&>option]:bg-superficie"
                    >
                        {chavesAtuais.map((periodo) => (
                            <option key={periodo} value={periodo}>
                                {visualizacao === 'mensal'
                                    ? formatarRotuloMensal(periodo)
                                    : periodo}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="h-[320px] w-full">
                {dados.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-sm text-texto-suave">
                        Sem dados de vendas para os períodos selecionados.
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={dados}
                            margin={{
                                top: 10,
                                right: 20,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke={corGrafico.grade} />

                            <XAxis
                                dataKey="periodo"
                                stroke={corGrafico.eixo}
                                tickLine={false}
                            />

                            <YAxis
                                stroke={corGrafico.eixo}
                                tickLine={false}
                                width={85}
                                tickFormatter={formatarMoeda}
                            />

                            <Tooltip
                                {...estiloTooltip}
                                formatter={(value) => formatarMoeda(value)}
                            />

                            <Legend
                                wrapperStyle={{
                                    color: corGrafico.eixo || '#F5F5F5',
                                }}
                            />

                            <Line
                                type="monotone"
                                dataKey="periodo1"
                                name={nomeLinha1}
                                stroke={cor1}
                                strokeWidth={3}
                                dot={{ r: 4, fill: cor1 }}
                                activeDot={{ r: 7 }}
                            />

                            <Line
                                type="monotone"
                                dataKey="periodo2"
                                name={nomeLinha2}
                                stroke={cor2}
                                strokeWidth={3}
                                dot={{ r: 4, fill: cor2 }}
                                activeDot={{ r: 7 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}