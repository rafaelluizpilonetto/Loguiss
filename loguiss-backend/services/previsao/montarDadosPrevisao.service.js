export async function montarDadosPrevisao({
  horizonteDias,
  idsProdutos = [],
  prazoPadraoDias,
}) {
  const hoje = calc.chaveData();
  const ontem = calc.somarDias(hoje, -1);

  const datasPrevisao = calc.intervaloDias(
    calc.somarDias(hoje, 1),
    horizonteDias










  );

  const diasHistorico = calc.intervaloDias(
    calc.somarDias(ontem, -(DIAS_HISTORICO - 1)),
    DIAS_HISTORICO
  );

  const idsFiltro = idsProdutos.length
    ? [...new Set(idsProdutos)]
    : [];

  const filtroProdutos = {
    flag_ativo: 'T',
    estoque: { isNot: null },
    ...(idsFiltro.length ? { id_produto: { in: idsFiltro } } : {}),
  };

  const produtosCandidatos = await prisma.produto.findMany({
    where: filtroProdutos,
    orderBy: { id_produto: 'asc' },
    select: { id_produto: true },
  });

  if (!produtosCandidatos.length) {
    throw erroHttp(
      404,
      'Nenhum produto ativo com estoque cadastrado.',
      'SEM_PRODUTOS'
    );
  }

  const dataCorteHistorico = new Date(
    `${diasHistorico[0]}T00:00:00-03:00`
  );

  const vendasAgrupadas =
    await prisma.movimentacao_estoque.groupBy({
      by: ['id_produto', 'tipo'],
      where: {
        id_produto: {
          in: produtosCandidatos.map(
            (produto) => produto.id_produto
          ),
        },
        data_movimento: { gte: dataCorteHistorico },
      },
      _sum: { quantidade: true },
    });

  const idsSelecionados = calc
    .ordenarProdutosPorVendas(
      produtosCandidatos.map(
        (produto) => produto.id_produto
      ),
      vendasAgrupadas
    )
    .slice(0, MAX_PRODUTOS_PREVISAO);

  const produtosEncontrados =
    await prisma.produto.findMany({
      where: {
        flag_ativo: 'T',
        estoque: { isNot: null },
        id_produto: { in: idsSelecionados },
      },
      include: {
        estoque: true,
        unidade_medida: true,
        tipo_produto: true,
        categorias: {
          include: {
            categoria: true,
          },
        },
      },
      orderBy: { id_produto: 'asc' },
    });

  const produtosPorId = new Map(
    produtosEncontrados.map((produto) => [
      produto.id_produto,
      produto,
    ])
  );

  const produtos = idsSelecionados
    .map((id) => produtosPorId.get(id))
    .filter(Boolean);

  if (!produtos.length) {
    throw erroHttp(
      404,
      'Nenhum produto ativo com estoque cadastrado.',
      'SEM_PRODUTOS'
    );
  }

  const movimentos =
    await prisma.movimentacao_estoque.findMany({
      where: {
        id_produto: { in: idsSelecionados },
        data_movimento: { gte: dataCorteHistorico },
      },
      orderBy: [
        { data_movimento: 'desc' },
        { id_movimentacao: 'desc' },
      ],
      take: MAX_MOVIMENTACOES_PREVISAO,
      select: {
        id_produto: true,
        tipo: true,
        quantidade: true,
        data_movimento: true,
        prazo_chegada: true,
      },
    });

  const porProduto = new Map();

  for (const movimento of movimentos) {
    let lista = porProduto.get(movimento.id_produto);

    if (!lista) {
      lista = [];
      porProduto.set(movimento.id_produto, lista);
    }

    lista.push(movimento);
  }

  const entradas = produtos.map((produto) =>
    calc.montarEntradaProduto(
      produto,
      porProduto.get(produto.id_produto) ?? [],
      diasHistorico,
      prazoPadraoDias
    )
  );

  return {
    hoje,
    horizonteDias,
    datasPrevisao,
    dataInicioPrevisao: datasPrevisao[0],
    dataFimPrevisao:
      datasPrevisao[datasPrevisao.length - 1],
    entradas,
  };
}