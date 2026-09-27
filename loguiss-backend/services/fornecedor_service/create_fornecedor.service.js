import {prisma} from "../../database.js";


export default async function create_fornecedor_service(req, res) {
    const{
        cnpj,
        email,
        nome,
        telefone,
        bairro,
        estado,
        numero,
        rua
    } = req.body

    if(!cnpj || !email || !nome || !telefone){
        return res.status(400).json({MSG: "Algum dado faltante, favor conferir!!"})
    }

    try {

        const cnpj_fornecedor = await prisma.fornecedor.findUnique({
            where:{
                cnpj: cnpj
            }
        })
        if(cnpj_fornecedor == null){
            const create_fornecedor = await prisma.$transaction( async (tx)=>{
                
                const endereco_fornecedor = await tx.endereco.create({
                    data:{
                        bairro: bairro,
                        estado: estado,
                        numero: numero,
                        rua: rua
                    }
                })


                const fornecedor = await tx.fornecedor.create({
                    data:{
                        cnpj: cnpj,
                        email: email,
                        id_endereco: endereco_fornecedor.id_endereco,
                        nome: nome,
                        telefone: telefone
                    },
                    include:{
                        endereco: true
                    }
                })        
            })

            return res.status(200).json({MSG: "Fornecedor criado com sucesso!", fornecedor: create_fornecedor})
        }
        else{
            return res.status(400).json({MSG:"CNPJ informado já cadastrado!", cnpj: cnpj})
        }
        
    } catch (error) {
        console.log(error)
    }
}