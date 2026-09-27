import { prisma } from "../../database.js";

export async function edit_fornecedor_service(req, res) {
    const{
        email,
        nome,
        telefone,
        bairro,
        estado,
        numero,
        rua
    } = req.body
    const {id_fornecedor} = req.params

    const existe_fornecedor = await prisma.fornecedor.findUnique({
        where:{
            id_fornecedor: Number(id_fornecedor)
        }
    })
    if(!existe_fornecedor){
        return res.status(400).json({MSG: "Fornecedor não encontrado ou não existe!"})
    }

    try {
        const update_fornecedor = await prisma.$transaction( async (tx)=>{

            const update_endereco = tx.endereco.update({
                where:{
                    id_fornecedor: Number(id_fornecedor)
                },
                data:{
                    bairro: bairro,
                    numero: numero,
                    rua: rua,
                    estado: estado
                }
            })


            const fornecedor = await tx.fornecedor.update({
                where:{
                    id_fornecedor: Number(id_fornecedor),
                },
                data:{
                    email: email,
                    nome: nome,
                    telefone: telefone
                },
                include:{
                    endereco: true
                }
            })

        })
        return res.status(200).json({MSG: "Forncedor editado!!", fornecedor: update_fornecedor})

    } catch (error) {
        console.log(error)
    }

}