import { prisma } from '../../database.js';
import { calcular_quantidade_perdida } from './calcular_quantidade_perdida.js';
import { parse_data_iso } from './parse_data_iso.js';

export async function edit_produto_service(req, res) {
    const id = Number(req.params.id_produto);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ MSG: 'ID do produto inválido!' });
    }

    const valorDtValidade =
        req.body.dt_validade !== undefined
            ? req.body.dt_validade
            : req.body.estoque?.dt_validade;

    let dt_validade;
    try {
        dt_validade = parse_data_iso(valorDtValidade, 'Data de validade');
    } catch (error) {
        return res.status(400).json({ MSG: error.message });
    }

    try {
        const produto = await prisma.produto.findUnique({
            where: { id_produto: id },
            include: {
                receita_producao: true,
                tipo_produto: true,
            },
        });
        if (!produto) {
            return res.status(404).json({ MSG: 'Produto não encontrado!' });
        }

        const flagTipoSolicitado = String(req.body.flag_tipo ?? req.body.tipo ?? '')
            .trim()
            .toUpperCase();
        const flagTipoAtual = String(produto.tipo_produto?.flag_tipo ?? '').toUpperCase();
        const idTipoSolicitado = req.body.id_tipo_produto;
        const tentouAlterarId =
            idTipoSolicitado !== undefined &&
            idTipoSolicitado !== null &&
            idTipoSolicitado !== '' &&
            Number(idTipoSolicitado) !== produto.id_tipo_produto;

        if (
            tentouAlterarId ||
            (flagTipoSolicitado && flagTipoAtual && flagTipoSolicitado !== flagTipoAtual)
        ) {
            return res.status(400).json({
                MSG: 'Não é permitido alterar o tipo do produto após o cadastro.',
            });
        }

        const atualizaReceita =
            produto.tipo_produto?.flag_tipo === 'P' && req.body.receita !== undefined;
        const receita = req.body.receita;
        const ingredientes = req.body.ingredientes;
        let quantidadePerdida;

        if (atualizaReceita) {
            if (
                !receita ||
                typeof receita.descricao !== 'string' ||
                !receita.descricao.trim() ||
                !Array.isArray(ingredientes) ||
                ingredientes.length === 0
            ) {
                return res.status(400).json({
                    MSG: 'Informe a receita e ao menos um ingrediente para produto de produção.',
                });
            }

            try {
                quantidadePerdida = calcular_quantidade_perdida(
                    receita.quantidade_produzida,
                    receita.margem_perda,
                );
            } catch (error) {
                return res.status(400).json({ MSG: error.message });
            }

            const idsIngredientes = new Set();
            const ingredientesInvalidos = ingredientes.some((ingrediente) => {
                const idProduto = Number(ingrediente.id_produto);
                const idUnidade = Number(ingrediente.unidade_medida_ingrediente);
                const quantidade = Number(ingrediente.quantidade);
                const repetido = idsIngredientes.has(idProduto);
                idsIngredientes.add(idProduto);

                return (
                    !Number.isInteger(idProduto) ||
                    idProduto <= 0 ||
                    !Number.isInteger(idUnidade) ||
                    idUnidade <= 0 ||
                    !Number.isFinite(quantidade) ||
                    quantidade < 0 ||
                    repetido
                );
            });

            if (ingredientesInvalidos) {
                return res.status(400).json({
                    MSG: 'Verifique os produtos, unidades e quantidades dos ingredientes.',
                });
            }
        }

        const produtoAtualizado = await prisma.$transaction(async (tx) => {
            const atualizado = await tx.produto.update({
                where: { id_produto: id },
                data: {
                    descricao: req.body.descricao,
                    id_unidade_medida: req.body.id_unidade_medida,
                    valor: req.body.valor,
                    flag_ativo: req.body.flag_ativo,
                    ...(dt_validade !== undefined && { dt_validade }),
                },
            });

            if (atualizaReceita) {
                const dadosReceita = {
                    descricao: receita.descricao.trim(),
                    margem_perda: Number(receita.margem_perda ?? 0),
                    quantidade_perdida: quantidadePerdida,
                    quantidade_produzida: Number(receita.quantidade_produzida ?? 0),
                };
                const receitaSalva = produto.receita_producao
                    ? await tx.receita.update({
                          where: { id_receita: produto.receita_producao.id_receita },
                          data: dadosReceita,
                      })
                    : await tx.receita.create({
                          data: {
                              ...dadosReceita,
                              id_produto_producao: id,
                          },
                      });

                await tx.receita_produto.deleteMany({
                    where: { id_receita: receitaSalva.id_receita },
                });

                await tx.receita_produto.createMany({
                    data: ingredientes.map((ingrediente) => ({
                        id_receita: receitaSalva.id_receita,
                        id_produto: Number(ingrediente.id_produto),
                        quantidade: Number(ingrediente.quantidade),
                        id_unidade: Number(ingrediente.unidade_medida_ingrediente),
                    })),
                });
            }

            return atualizado;
        });

        return res.status(200).json({
            MSG: 'Produto atualizado com sucesso!',
            produto: produtoAtualizado,
        });
    } catch (error) {
        console.error('Erro ao editar produto:', error);
        return res.status(500).json({ MSG: 'Erro ao atualizar produto!' });
    }
}
