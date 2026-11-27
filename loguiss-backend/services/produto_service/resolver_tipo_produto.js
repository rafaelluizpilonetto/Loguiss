export async function resolver_tipo_produto(prisma, dados) {
    const flagTipo = String(dados.flag_tipo ?? dados.tipo ?? '')
        .trim()
        .toUpperCase();

    if (flagTipo) {
        if (flagTipo !== 'P' && flagTipo !== 'N') return null;

        return prisma.tipo_produto.findFirst({
            where: { flag_tipo: flagTipo },
        });
    }

    const idTipoProduto = Number(dados.id_tipo_produto);
    if (!Number.isInteger(idTipoProduto) || idTipoProduto <= 0) return null;

    return prisma.tipo_produto.findUnique({
        where: { id_tipo_produto: idTipoProduto },
    });
}
