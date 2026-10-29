import { useState } from 'react';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { ChevronDown } from 'lucide-react';
import { Button } from '../button';

const periodos = [
    { label: 'Últimos 3 meses', meses: 3 },
    { label: 'Últimos 6 meses', meses: 6 },
    { label: 'Últimos 12 meses', meses: 12 },
];

const dados = [
    { mes: 'Jan', entradas: 120, saidas: 80 },
    { mes: 'Fev', entradas: 150, saidas: 100 },
    { mes: 'Mar', entradas: 180, saidas: 130 },
    { mes: 'Abr', entradas: 140, saidas: 90 },
    { mes: 'Mai', entradas: 200, saidas: 150 },
    { mes: 'Jun', entradas: 120, saidas: 80 },
    { mes: 'Jul', entradas: 150, saidas: 100 },
    { mes: 'Ago', entradas: 180, saidas: 130 },
    { mes: 'Set', entradas: 140, saidas: 90 },
    { mes: 'Out', entradas: 200, saidas: 150 },
    { mes: 'Nov', entradas: 120, saidas: 80 },
    { mes: 'Dez', entradas: 150, saidas: 100 },
];

export function Movimentacoes() {
    const [periodoSelecionado, setPeriodoSelecionado] =
        useState(periodos[2]);

    const [menuAberto, setMenuAberto] = useState(false);

    const mesAtual = new Date().getMonth();

    const dadosFiltrados = Array.from(
        { length: periodoSelecionado.meses },
        (_, indice) => {
            const indiceMes =
                (
                    mesAtual -
                    periodoSelecionado.meses +
                    1 +
                    indice +
                    dados.length
                ) % dados.length;

            return dados[indiceMes];
        }
    );

    return (
        <div className="h-[380px] w-full rounded-xl border border-gray-800 bg-[#0d0920] p-5 mb-5">
            <div className="mb-2 flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold">
                    Movimentações
                </h2>

                <p className="mr-4 text-sm text-gray-400">
                    <span className="text-[#4EDB4E]">Entradas</span>
                    {` e `}
                    <span className="text-[#ef4444]">Saídas</span>
                </p>

                <div className="relative">
                    <Button
                        type="button"
                        className="w-auto bg-[#4EDB4E] p-2 hover:bg-[#3CB43C]"
                        aria-haspopup="menu"
                        aria-expanded={menuAberto}
                        onClick={() =>
                            setMenuAberto((aberto) => !aberto)
                        }
                        onKeyDown={(event) => {
                            if (event.key === 'Escape') {
                                setMenuAberto(false);
                            }
                        }}
                    >
                        <span className="flex items-center justify-center">
                            {periodoSelecionado.label}
                            <ChevronDown className="ml-2" size={20} />
                        </span>
                    </Button>

                    {menuAberto && (
                        <ul
                            className="absolute right-0 z-10 mt-2 min-w-full overflow-hidden rounded-lg border border-gray-700 bg-[#0d0920] py-1 shadow-lg"
                            role="menu"
                            aria-label="Selecionar período"
                        >
                            {periodos.map((periodo) => (
                                <li key={periodo.meses} role="none">
                                    <button
                                        type="button"
                                        role="menuitem"
                                        className={`w-full whitespace-nowrap px-4 py-2 text-left text-sm transition-colors hover:bg-[#2a2638] ${periodoSelecionado.meses === periodo.meses
                                                ? 'text-[#4EDB4E]'
                                                : 'text-white'
                                            }`}
                                        onClick={() => {
                                            setPeriodoSelecionado(periodo);
                                            setMenuAberto(false);
                                        }}
                                    >
                                        {periodo.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <ResponsiveContainer width="100%" height="90%">
                <BarChart data={dadosFiltrados}>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#2a2638"
                    />

                    <XAxis dataKey="mes" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />

                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#15102b',
                            border: '1px solid #2a2638',
                            borderRadius: '8px',
                            color: '#ffffff'
                        }}
                        labelStyle={{
                            color: '#ffffff',
                            fontWeight: 'bold'
                        }}
                        cursor={{
                            fill: '#ffffff',
                            fillOpacity: 0.05
                        }}
                    />

                    <Bar
                        dataKey="entradas"
                        name="Entradas"
                        fill="#22c55e"
                        radius={[4, 4, 0, 0]}
                    />

                    <Bar
                        dataKey="saidas"
                        name="Saídas"
                        fill="#ef4444"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
