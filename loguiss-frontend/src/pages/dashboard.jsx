import { useState } from 'react';
import { SideBar } from '../components/Sidebar';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from '../components/button';
import { ChevronDown } from 'lucide-react';

const periodos = [
    { label: 'Últimos 3 meses', meses: 3 },
    { label: 'Últimos 6 meses', meses: 6 },
    { label: 'Últimos 12 meses', meses: 12 },
];

function Dashboard() {
    const [periodoSelecionado, setPeriodoSelecionado] = useState(periodos[2]);
    const [menuAberto, setMenuAberto] = useState(false);

    const dados = [
        { mes: "Jan", entradas: 120, saidas: 80 },
        { mes: "Fev", entradas: 150, saidas: 100 },
        { mes: "Mar", entradas: 180, saidas: 130 },
        { mes: "Abr", entradas: 140, saidas: 90 },
        { mes: "Mai", entradas: 200, saidas: 150 },
        { mes: "Jun", entradas: 120, saidas: 80 },
        { mes: "Jul", entradas: 150, saidas: 100 },
        { mes: "Ago", entradas: 180, saidas: 130 },
        { mes: "Set", entradas: 140, saidas: 90 },
        { mes: "Out", entradas: 200, saidas: 150 },
        { mes: "Nov", entradas: 120, saidas: 80 },
        { mes: "Dez", entradas: 150, saidas: 100 },
    ];

    const mesAtual = new Date().getMonth();
    const dadosFiltrados = Array.from(
        { length: periodoSelecionado.meses },
        (_, indice) => {
            const indiceMes = (
                mesAtual - periodoSelecionado.meses + 1 + indice + dados.length
            ) % dados.length;

            return dados[indiceMes];
        }
    );

    return (
        <div className="min-h-screen bg-[#050212] text-white">

            <SideBar />

            <main className="ml-72 min-h-screen p-5">

                <div className="flex items-center justify-between mb-3">
                
                    <div>
                        <h1 className="text-3xl font-bold mb-2 mt-2">
                            Dashboards
                        </h1>

                        <p className="text-gray-400">
                            Esta é a página de dashboards. Aqui você pode visualizar as métricas e indicadores do sistema.
                        </p>

                    </div>


                    <div className="relative mt-2">
                        <Button
                            type="button"
                            className="bg-[#4EDB4E] hover:bg-[#3CB43C] p-3 w-auto"
                            aria-haspopup="menu"
                            aria-expanded={menuAberto}
                            onClick={() => setMenuAberto((aberto) => !aberto)}
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
                                            className={`w-full whitespace-nowrap px-4 py-2 text-left text-sm transition-colors hover:bg-[#2a2638] ${
                                                periodoSelecionado.meses === periodo.meses
                                                    ? 'text-[#4EDB4E]'
                                                    : 'text-white'
                                            }`}
                                            aria-current={
                                                periodoSelecionado.meses === periodo.meses
                                                    ? 'true'
                                                    : undefined
                                            }
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

                <div className="h-[350px] w-full rounded-xl border border-gray-800 bg-[#0d0920] p-5">

                    <h2 className="mb-5 text-xl font-bold">
                        Movimentações
                    </h2>

                    <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={dadosFiltrados}>

                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#2a2638"
                            />

                            <XAxis
                                dataKey="mes"
                                stroke="#9ca3af"
                            />

                            <YAxis
                                stroke="#9ca3af"
                            />

                            <Tooltip />

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

            </main>

        </div>
    );
}

export default Dashboard;