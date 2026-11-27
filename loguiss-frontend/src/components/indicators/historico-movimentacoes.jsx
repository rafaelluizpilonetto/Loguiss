import { ArrowUpRight, ClipboardList, Package } from 'lucide-react';

const formatarNumeroBR = (valor, decimais = 0) =>
    Number(valor).toLocaleString('pt-BR', {
        minimumFractionDigits: decimais,
        maximumFractionDigits: decimais,
    });

export function HistoricoMovimentacoes({
    titulo = 'Histórico de movimentações',
    descricao = 'Saídas recentes da amostra',
    dados = [],
    badgeRodape = 'Dados demonstrativos',
}) {
    const itensFiltrados = dados.filter((item) => item.tipo === 'saida');

    return (
        <div className="mt-4 w-full min-w-0 rounded-xl border border-borda bg-superficie p-5">
            {/* Cabeçalho */}
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primaria/10">
                        <ClipboardList size={20} className="text-primaria" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-texto">{titulo}</h2>
                        <p className="text-xs text-texto-suave">{descricao}</p>
                    </div>
                </div>
            </div>
            <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[540px] border-collapse text-left">
                    <thead>
                        <tr className="border-b border-borda text-[11px] font-semibold uppercase tracking-wider text-texto-suave">
                            <th className="pb-3 pr-4">Data</th>
                            <th className="pb-3 px-3">Produto</th>
                            <th className="pb-3 px-3">Tipo</th>
                            <th className="pb-3 px-3">Origem</th>
                            <th className="pb-3 pl-3 text-right">Qtd.</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-borda">
                        {itensFiltrados.map((item) => {
                            const temDecimal = !Number.isInteger(item.quantidade);

                            return (
                                <tr
                                    key={item.id || `${item.codigo}-${item.documento}`}
                                    className="transition-colors hover:bg-elevada/60"
                                >
                                    {/* Data / Hora */}
                                    <td className="py-3.5 pr-4 align-middle whitespace-nowrap">
                                        <div className="text-sm font-semibold text-texto">
                                            {item.dataLabel}
                                        </div>
                                        <div className="text-xs text-texto-suave">{item.hora}</div>
                                    </td>
                                    <td className="py-3.5 px-3 align-middle">
                                        <div className="text-sm font-semibold text-texto">
                                            {item.produto}
                                        </div>
                                        <div className="text-xs text-texto-suave">
                                            {item.codigo}
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-3 align-middle whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-borda bg-fundo px-2.5 py-1 text-xs font-medium text-texto">
                                            <ArrowUpRight size={13} className="text-primaria" />
                                            <span>Saída</span>
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-3 align-middle whitespace-nowrap">
                                        <div className="text-sm font-medium text-texto">
                                            {item.origem}
                                        </div>
                                        <div className="text-xs text-texto-suave">
                                            {item.documento}
                                        </div>
                                    </td>
                                    <td className="py-3.5 pl-3 text-right align-middle whitespace-nowrap">
                                        <span className="text-sm font-bold text-texto">
                                            -{formatarNumeroBR(item.quantidade, temDecimal ? 1 : 0)}
                                        </span>{' '}
                                        <span className="text-xs text-texto-suave">
                                            {item.unidade}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-borda pt-3 text-xs text-texto-suave">
                <div className="inline-flex items-center gap-2">
                    <Package size={14} className="text-primaria" />
                    <span>{itensFiltrados.length} saídas recentes</span>
                </div>

                <span>{badgeRodape}</span>
            </div>
        </div>
    );
}