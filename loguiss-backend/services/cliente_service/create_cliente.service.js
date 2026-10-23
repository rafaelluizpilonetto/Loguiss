import { prisma } from "../../database.js";

export async function create_cliente_service(req, res) {
    const {
        email,
        nome_cliente,
        telefone,
        cpf_cnpj
    } = req.body

    if(!email || !nome_cliente || !telefone || !cpf_cnpj){
        return res.status(400).json({MSG: "Alguns dados faltantes, favor conferir!"})
    }

    try {
        const create_cliente = await prisma.cliente.create({
            data:{
                email: email,
                nome: nome_cliente,
                cpf: cpf_cnpj,
                telefone: telefone
            }
        });
        
        return res.status(200).json({MSG: "Cliente criado com sucesso!!", cliente: create_cliente})

    } catch (error) {
        console.log(error)
    }
}