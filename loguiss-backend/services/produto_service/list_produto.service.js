import { prisma } from '../../database.js';

export default async function list_produto_service(req, res) {
    try {
        const produtos = await prisma.produto.findMany({
            where:{
                flag_ativo: "T"
            },
            include:{
                categorias:{
                    include:{
                        categoria: true
                    }
                },
                fornecedores:{
                    include:{
                        fornecedor: true
                    }
                },
                estoque:{
                    include: true
                },
                unidade_medida: true,
                tipo_produto: true,
                receita_producao: {
                    include: {
                        produtos: {
                            include: {
                                produto: true,
                                unidade_medida: true,
                            },
                        },
                    },
                },
            }
        })
        return res.status(200).json({MSG: "produtos encontrados!!", produtos: produtos})
    } catch (error) {
        console.log(error)
    }
    
}