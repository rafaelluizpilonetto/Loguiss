import { prisma } from '../../database.js';

export async function create_produto_service(req, res) {
    const estoque = req.body.estoque;
    const ingredientes = req.body.ingredientes;
    const receita = req.body.receita;

    const {
        descricao, 
        id_tipo_produto, 
        id_unidade_medida, 
        valor, 
        flag_ativo,
        id_categoria_user,
    } = req.body;
    const campos_obrigatorios = [
        descricao, 
        id_tipo_produto, 
        id_unidade_medida, 
        valor, 
        id_categoria_user,
        estoque.id_receita,
        estoque.id_fornecedor_user,
        estoque.is_fracionado,
        estoque.quantidade,
        estoque.dt_entrada,
        estoque.minimo,
        estoque.prazo_saida,
     ]
        // produto vem descricao; id_tipo_produto; id_unidade_medida; is_fracionado; valor; flag_ativo; id_categoria_user

        // estoque vem id_fornecedor_user; quantidade; dt_entrada; minimo; prazo_saida

        // receita vem descricao; flag_ativo; margem_perda; quantidade_produzida; quantidade_perdida

        // ingredientes vem quantidade; id_unidade; id_produto

    if(campos_obrigatorios.some(campo => campo === "")){ // vai verificar se existe algum campo vazio na lista de obrigatórios
        return res.status(400).json({MSG: "Algum campo está faltando, por favor verifique!!"})
    }
    try {


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


        const tipo_produto = await prisma.tipo_produto.findUnique({
            where:{
                id_tipo_produto: id_tipo_produto
            }
        })

        if(tipo_produto.flag_tipo == 'P'){

            const produto_producao = await prisma.$transaction(async (tx) =>{

                const produto = await tx.produto.create({
                    data:{
                        descricao: descricao,
                        id_tipo_produto: id_tipo_produto,
                        id_unidade_medida: id_unidade_medida,
                        valor: valor,
                        flag_ativo: flag_ativo
                    }
                })

                const receita_create = await tx.receita.create({
                    data:{
                        descricao: receita.descricao,
                        margem_perda: receita.margem_perda,
                        quantidade_perdida: receita.quantidade_perdida,
                        quantidade_produzida: receita.quantidade_produzida
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
                        dt_entrada: estoque.dt_entrada,
                        is_fracionado: estoque.is_fracionado,
                        minimo: estoque.minimo,
                        prazo_saida: estoque.prazo_saida
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
                            id_tipo_produto: id_tipo_produto,
                            id_unidade_medida: id_unidade_medida,
                            valor: valor,
                            flag_ativo: flag_ativo
                        }
                    })
                    const estoque_create = await tx.estoque.create({
                        data:{
                            id_produto: produto.id_produto,
                            dt_entrada: estoque.dt_entrada,
                            is_fracionado: estoque.is_fracionado,
                            minimo: estoque.minimo,
                            prazo_saida: estoque.prazo_saida,
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
                            categoria: id_categoria_user
                        }
                    })



                })

                return res.status(200).json({MSG: "Produto normal criado com sucesso!", produto_normal: produto_normal})
                
            } catch (error) {
                console.log(error)
            }



        }


    } catch (error) {
        console.log(error)
    }
}