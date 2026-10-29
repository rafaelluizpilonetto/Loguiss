///Arquivo para armazenar os dados ficticios do dashboard, como entradas e saídas, 
// para serem utilizados nos gráficos e tabelas da página de dashboard.
// Depois podemos apagar.

export const produtos = [
    {
        id: 1,
        nome: "Parafuso M8",
        categoria: "Matéria-prima",
        estoqueAtual: 8,
        estoqueMinimo: 20,
        valorUnitario: 0.50,
        saidas: 150,
    },
    {
        id: 2,
        nome: "Chapa de aço",
        categoria: "Matéria-prima",
        estoqueAtual: 35,
        estoqueMinimo: 15,
        valorUnitario: 45.00,
        saidas: 40,
    },
    {
        id: 3,
        nome: "Embalagem P",
        categoria: "Embalagem",
        estoqueAtual: 15,
        estoqueMinimo: 30,
        valorUnitario: 1.20,
        saidas: 120,
    },
    {
        id: 4,
        nome: "Produto acabado A",
        categoria: "Produto acabado",
        estoqueAtual: 80,
        estoqueMinimo: 25,
        valorUnitario: 75.00,
        saidas: 220,
    },
    {
        id: 5,
        nome: "Produto acabado B",
        categoria: "Produto acabado",
        estoqueAtual: 12,
        estoqueMinimo: 20,
        valorUnitario: 95.00,
        saidas: 90,
    },
];

export const movimentacoes = [
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
