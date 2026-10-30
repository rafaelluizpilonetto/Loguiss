import { prisma } from "../../database.js";

export default async function create_movi_service(req, res) {
    const {
        data_movi,
        id_cliente,
        id_produto,
        quantidade,
        tipo, // S = saída // E = Entrada 
        valor_unitario,
        id_fornecedor,
    } = req.body

    if(!data_movi || !id_produto || !quantidade || !tipo || !valor_unitario){
        return res.status(400).json({MSG: "Algum dado faltante, favor verificar! "})
    }
    if(tipo == 'E' && !id_fornecedor){
        return res.satus(400).json({MSG: "está faltando o fornecedor, favor inserir!"})
    }
    else if(tipo == 'S' && !id_cliente){
        return res.satus(400).json({MSG: "está faltando o cliente, favor inserir!"})
    }



    if(tipo == "S"){

        try {
            const movimentacao = await prisma.$transaction( async (pris)=>{

                const produto_quantidade = await  pris.estoque.findUnique({ // Apenas pegando a quantidade do produto para usar depois da subtração do estoque antigo com a quantidade que será retirada 
                    where:{
                    id_produto: Number(id_produto)
                    }
                })
                if(produto_quantidade.quantidade < 0){ // como vai vender algo que vc não tem?
                    throw new Error( "produto com estoque menor ou igual a zero! Impossível  de realizar movimentação sem estoque")
                }

                const produto =  await pris.estoque.update({ // umas das partes importantes, subtração  da quantidade atual do produto
                    where:{
                        id_produto: Number(id_produto)
                    },
                    data:{
                        quantidade: Number(produto_quantidade.quantidade) - Number(quantidade)
                    }
                })
                if(produto.quantidade < 0 ){ // se ficar com algo negativo é por que vai faltar, logo não é possível fazer 
                     throw new Error("não foi possível registrar movimentação! produto ficou com estoque negativo após alteração!")
                }
                
                
                const movi = await pris.movimentacao_estoque.create({
                    data:{
                        data_movimento: new Date(),
                        id_cliente: Number(id_cliente),
                        id_produto: Number(id_produto),
                        quantidade: Number(quantidade),
                        saldo_final: produto.quantidade,
                        tipo: tipo,
                        valor_total: valor_unitario * Number(quantidade),
                        valor_unitario: Number(valor_unitario)
                    }
                })

            })

            return res.status(200).json({MSG: "Movimentação criada com sucesso!", movimentacao: movimentacao})

        } catch (error) {
            console.log("erro nas movimentações: \n", error )
        }



    }
    else if(tipo == 'E'){
        try {
            const movimentacao_entrada = await prisma.$transaction( async (pris) =>{
                const produto_quantidade = await  pris.estoque.findUnique({ // Apenas pegando a quantidade do produto para usar depois da subtração do estoque antigo com a quantidade que será retirada 
                    where:{
                    id_produto: Number(id_produto)
                    }
                })
            
                const produto =  await pris.estoque.update({ // umas das partes importantes, subtração  da quantidade atual do produto
                    where:{
                        id_produto: Number(id_produto)
                    },
                    data:{
                        quantidade: Number(produto_quantidade.quantidade) + Number(quantidade)
                    }
                })               

                const movi = await pris.movimentacao_estoque.create({
                    data:{
                        data_movimento: new Date(),
                        id_cliente: Number(id_cliente),
                        id_produto: Number(id_produto),
                        quantidade: Number(quantidade),
                        saldo_final: produto.quantidade,
                        tipo: tipo,
                        valor_total: valor_unitario * Number(quantidade),
                        valor_unitario: Number(valor_unitario)
                    }
                })

            })
            return res.status(200).json({MSG: "Movimentação criada com sucesso!", movimentacao: movimentacao_entrada})
            
        } catch (error) {
            console.log("erro nas movimentações: \n", error )
        }
    }





}