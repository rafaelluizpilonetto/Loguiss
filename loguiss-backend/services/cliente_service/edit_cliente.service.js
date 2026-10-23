import { prisma } from "../../database.js";

export async function edit_cliente_service(req, res) {
    const{
        id_cliente,
        nome_cliente,
        email,
        cpf_cnpj,
        telefone

    } = req.body
    
    if(!email || !nome_cliente || !telefone || !cpf_cnpj || !id_cliente){
        return res.status(400).json({MSG: "Alguns dados faltantes, favor conferir!"})
    }
    try {
        const existe_cliente = await prisma.cliente.findUnique({
            where:{
                id_cliente: Number(id_cliente)
            }
        })
        if(!existe_cliente){
            return res.status(400).json({MSG: "Cliente não encontrado"})
        }

        const edit_cliente = await prisma.cliente.update({
            where:{
                id_cliente: Number(id_cliente),
            },
            data:{
                email: email,
                nome: nome_cliente,
                cpf: cpf_cnpj,
                telefone: telefone
            }
        })
        return res.status(200).json({MSG: "Cliente Atualizado!", cliente: edit_cliente})
        
    } catch (error) {
        console.log(error)
    }

}