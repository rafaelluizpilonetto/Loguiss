import {
    Pie,
    PieChart,
    ResponsiveContainer,
    Sector,
    Tooltip,
    useActiveTooltipDataPoints,
    useIsTooltipActive,
} from 'recharts';

import { estiloTooltip } from '../../utils/graficos';

const COLORS = [
    'var(--primary)',
    'var(--primary-hover)',
    'color-mix(in srgb, var(--primary) 70%, var(--background))',
    'color-mix(in srgb, var(--primary) 45%, var(--background))',
];

const RADIAN = Math.PI / 180;

const MyCustomPie = (props) => {
    const pontosAtivos = useActiveTooltipDataPoints();
    const tooltipAtivo = useIsTooltipActive();

    const fatiaAtiva = tooltipAtivo && props.payload === pontosAtivos?.[0];
    const fillOpacity = tooltipAtivo && !fatiaAtiva ? 0.5 : 1;

    // Cálculo da posição do texto (80% perto da borda externa)
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.8;
    const x = Number(cx) + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const y = Number(cy) + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

    return (
        <g>
            <Sector
                {...props}
                fill={COLORS[props.index % COLORS.length]}
                stroke="none"
                fillOpacity={fillOpacity}
                style={{ transition: 'fill-opacity 0.3s ease' }}
            />

            {/* Exibe a porcentagem apenas na fatia que está com o mouse em cima */}
            {fatiaAtiva && (
                <text
                    x={x}
                    y={y}
                    fill="var(--on-primary)"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={13}
                    fontWeight="bold"
                    style={{ pointerEvents: 'none' }}
                >
                    {`${((percent ?? 0) * 100).toFixed(0)}%`}
                </text>
            )}
        </g>
    );
};

export function DistribuicaoCategoria({ produtos = [] }) {
    const dadosCategoria = Object.values(
        produtos.reduce((acumulador, produto) => {
            const categoria = produto.categoria;

            if (!acumulador[categoria]) {
                acumulador[categoria] = {
                    name: categoria,
                    value: 0,
                };
            }

            acumulador[categoria].value++;

            return acumulador;
        }, {}),
    );

    return (
        <div className="h-[380px] w-full rounded-xl border border-borda bg-superficie p-5">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-texto">Distribuição por categoria</h2>

                <p className="mt-1 text-sm text-texto-suave">
                    Quantidade de produtos em cada categoria
                </p>
            </div>

            <div className="h-[270px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={dadosCategoria}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={105}
                            shape={MyCustomPie}
                        />

                        <Tooltip
                            {...estiloTooltip}
                            itemStyle={{ color: 'var(--primary)' }}
                            formatter={(value, name) => [`${value} produtos`, name]}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
