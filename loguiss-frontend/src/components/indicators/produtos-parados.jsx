import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { corGrafico, estiloTooltip } from '../../utils/graficos';

export function ProdutosParados({ produtos = [] }) {
    const data = produtos
        .filter((produto) => produto.diasSemMovimentacao > 0)
        .sort((a, b) => b.diasSemMovimentacao - a.diasSemMovimentacao)
        .slice(0, 5);

    return (
        <div className="h-[380px] w-full rounded-xl border border-borda bg-superficie p-5">
            <div className="mb-5">
                <h2 className="text-xl font-bold text-texto">Produtos parados em estoque</h2>
                <p className="mt-1 text-sm text-texto-suave">
                    Produtos com maior tempo sem movimentação
                </p>
            </div>
            <ResponsiveContainer width="100%" height="85%">
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{
                        top: 5,
                        right: 0,
                        left: -10,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke={corGrafico.grade} />
                    <XAxis
                        type="number"
                        stroke={corGrafico.eixo}
                        allowDecimals={false}
                        tickLine={false}
                    />
                    <YAxis
                        type="category"
                        dataKey="nome"
                        stroke={corGrafico.eixo}
                        width={120}
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                    />
                    <Tooltip
                        {...estiloTooltip}
                        formatter={(value) => [`${value} dias`, 'Sem movimentação']}
                    />
                    <Bar
                        dataKey="diasSemMovimentacao"
                        name="Dias parados"
                        fill={corGrafico.primaria}
                        radius={[0, 5, 5, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
