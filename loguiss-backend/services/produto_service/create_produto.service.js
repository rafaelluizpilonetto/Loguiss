import { prisma } from '../../database.js';
import { calcular_quantidade_perdida } from './calcular_quantidade_perdida.js';
import { parse_data_iso } from './parse_data_iso.js';
import { resolver_tipo_produto } from './resolver_tipo_produto.js';

export async function create_produto_service(req, res) {
    const estoque = req.body.estoque;
    const ingredientes = req.body.ingredientes;
    const receita = req.body.receita;
    const valorDtValidade =
        req.body.dt_validade !== undefined ? req.body.dt_validade : estoque?.dt_validade;

    const {
        descricao, 
        id_unidade_medida, 
        valor, 
        flag_ativo,
        id_categoria_user,
    } = req.body;
    const idUnidadeMedida = Number(id_unidade_medida);

    if (!Number.isInteger(idUnidadeMedida) || idUnidadeMedida <= 0) {
        return res.status(400).json({ MSG: 'Selecione uma unidade de medida válida.' });
    }

    let dt_entrada;
    let prazo_saida;
    let dt_validade;
    try {
        dt_entrada = parse_data_iso(estoque?.dt_entrada, 'Data de entrada');
        prazo_saida = parse_data_iso(estoque?.prazo_saida, 'Prazo de saída');
        dt_validade = parse_data_iso(valorDtValidade, 'Data de validade');
    } catch (error) {
        return res.status(400).json({ MSG: error.message });
    }

    const campos_obrigatorios = [
        descricao, 
        id_unidade_medida, 
        valor, 
        id_categoria_user,
        estoque.id_receita,
        estoque.id_fornecedor_user,
        estoque.is_fracionado,
        estoque.quantidade,
        estoque.dt_entrada,
        estoque.minimo,
     ]
        // produto vem descricao; id_tipo_produto; id_unidade_medida; is_fracionado; valor; flag_ativo; id_categoria_user

        // estoque vem id_fornecedor_user; quantidade; dt_entrada; minimo; prazo_saida

        // receita vem descricao; margem_perda; quantidade_produzida

        // ingredientes vem quantidade; id_unidade; id_produto

    if(campos_obrigatorios.some(campo => campo === "")){ // vai verificar se existe algum campo vazio na lista de obrigatórios
        return res.status(400).json({MSG: "Algum campo está faltando, por favor verifique!!"})
    }
    try {
        const unidade = await prisma.unidade_medida.findUnique({
            where: { id_unidade: idUnidadeMedida },
        });
        if (!unidade) {
            return res.status(400).json({
                MSG: `A unidade selecionada (ID ${idUnidadeMedida}) não existe. Atualize a lista e selecione outra unidade.`,
            });
        }

        const existe_fornecedor = await prisma.fornecedor.findUnique({
            where:{
                id_fornecedor: estoque.id_fornecedor_user
            }
        })
        const existe_categoria = await prisma.categoria.findUnique({
            where:{
                id_categoria: id_categoria_user
            }
        })

        if(!existe_fornecedor){
            return res.status(400).json({MSG: "favor informar um fornecedor válido!"})
        }

        if(!existe_categoria){
            return res.status(400).json({MSG: "favor informar uma categoria válida!"})
        }


        const tipo_produto = await resolver_tipo_produto(prisma, req.body);
        if (!tipo_produto) {
            return res.status(400).json({ MSG: 'Tipo de produto inválido.' });
        }

        if (tipo_produto.flag_tipo === 'P') {
            if (!receita || !Array.isArray(ingredientes) || ingredientes.length === 0) {
                return res.status(400).json({
                    MSG: 'Informe a receita e ao menos um ingrediente para produto de produção.',
                });
            }

            let quantidadePerdida;
            try {
                quantidadePerdida = calcular_quantidade_perdida(
                    receita.quantidade_produzida,
                    receita.margem_perda,
                );
            } catch (error) {
                return res.status(400).json({ MSG: error.message });
            }

            const idsProdutosIngredientes = new Set();
            const idsUnidadesIngredientes = new Set();
            const ingredientesInvalidos = ingredientes.some((ingrediente) => {
                const idProduto = Number(ingrediente.id_produto);
                const idUnidade = Number(ingrediente.unidade_medida_ingrediente);
                const quantidade = Number(ingrediente.quantidade);
                const produtoRepetido = idsProdutosIngredientes.has(idProduto);
                idsProdutosIngredientes.add(idProduto);
                idsUnidadesIngredientes.add(idUnidade);

                return (
                    !Number.isInteger(idProduto) ||
                    idProduto <= 0 ||
                    !Number.isInteger(idUnidade) ||
                    idUnidade <= 0 ||
                    !Number.isFinite(quantidade) ||
                    quantidade < 0 ||
                    produtoRepetido
                );
            });

            if (ingredientesInvalidos) {
                return res.status(400).json({
                    MSG: 'Verifique os produtos, unidades e quantidades dos ingredientes.',
                });
            }

            const [produtosEncontrados, unidadesEncontradas] = await Promise.all([
                prisma.produto.findMany({
                    where: { id_produto: { in: [...idsProdutosIngredientes] } },
                    select: { id_produto: true },
                }),
                prisma.unidade_medida.findMany({
                    where: { id_unidade: { in: [...idsUnidadesIngredientes] } },
                    select: { id_unidade: true },
                }),
            ]);

            if (produtosEncontrados.length !== idsProdutosIngredientes.size) {
                return res.status(400).json({
                    MSG: 'Um ou mais produtos dos ingredientes não existem.',
                });
            }

            if (unidadesEncontradas.length !== idsUnidadesIngredientes.size) {
                return res.status(400).json({
                    MSG: 'Uma ou mais unidades dos ingredientes não existem. Selecione novamente a unidade.',
                });
            }

            const produto_producao = await prisma.$transaction(async (tx) =>{

                const produto = await tx.produto.create({
                    data:{
                        descricao: descricao,
                        id_tipo_produto: tipo_produto.id_tipo_produto,
                        id_unidade_medida: idUnidadeMedida,
                        valor: valor,
                        flag_ativo: flag_ativo,
                        dt_validade: dt_validade ?? null,
                    }
                })

                const receita_create = await tx.receita.create({
                    data:{
                        descricao: receita.descricao,
                        margem_perda: receita.margem_perda,
                        quantidade_perdida: quantidadePerdida,
                        quantidade_produzida: receita.quantidade_produzida,
                        id_produto_producao: produto.id_produto,
                    }
                })
                for(const ingrediente of ingredientes){
                    await tx.receita_produto.create({
                        data:{
                            id_receita: receita_create.id_receita,
                            id_produto: ingrediente.id_produto,
                            quantidade: ingrediente.quantidade,
                            id_unidade: ingrediente.unidade_medida_ingrediente
                        }
                    });

                }

                const estoque_create = await tx.estoque.create({
                    data:{
                        id_produto: produto.id_produto,
                        dt_entrada,
                        is_fracionado: estoque.is_fracionado,
                        minimo: estoque.minimo,
                        prazo_saida
                    }
                })

                const fornecedor_produto_create = await tx.fornecedor_produto.create({
                    data:{
                        id_fornecedor: estoque.id_fornecedor_user,
                        id_produto: produto.id_produto,
                        quantidade: estoque_create.quantidade
                    }
                })

                const produto_categoria_create = await tx.produto_categoria.create({
                    data:{
                        id_produto: produto.id_produto,
                        id_categoria: id_categoria_user
                    }
                })



            })

            return res.status(200).json({MSG: "Produto produção criado com sucesso!"})

        }else{
            try {

                const produto_normal = await prisma.$transaction(async (tx)=>{

                    const produto = await tx.produto.create({
                        data:{
                            descricao: descricao,
                            id_tipo_produto: tipo_produto.id_tipo_produto,
                            id_unidade_medida: idUnidadeMedida,
                            valor: valor,
                            flag_ativo: flag_ativo,
                            dt_validade: dt_validade ?? null,
                        }
                    })
                    const estoque_create = await tx.estoque.create({
                        data:{
                            id_produto: produto.id_produto,
                            dt_entrada,
                            is_fracionado: estoque.is_fracionado,
                            minimo: estoque.minimo,
                            prazo_saida,
                            quantidade: estoque.quantidade,

                        }
                    })

                    const forncedor_produto_create = await tx.fornecedor_produto.create({
                        data:{
                            id_fornecedor: estoque.id_fornecedor_user,
                            id_produto: produto.id_produto,
                            quantidade: estoque_create.quantidade
                        }
                    })
                    const produto_categoria_create = await tx.produto_categoria.create({
                        data:{
                            id_produto: produto.id_produto,
                            id_categoria: id_categoria_user
                        }
                    })



                })

                return res.status(200).json({MSG: "Produto normal criado com sucesso!", produto_normal: produto_normal})
                
            } catch (error) {
                console.error('Erro ao criar produto normal:', error);
                return res.status(500).json({ MSG: 'Erro ao criar produto.' });
            }



        }


    } catch (error) {
        console.error('Erro ao criar produto:', error);
        return res.status(500).json({ MSG: 'Erro ao criar produto.' });
    }
}