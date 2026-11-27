import { prisma } from "../../database.js";
import { validarCNPJ, validarCPF } from "../../utils/validacoes.js";

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
    const quantidade_digitos = String(cpf_cnpj).replace(/[^A-Z0-9]/gi, '').length
    const documento_valido = quantidade_digitos === 11
        ? validarCPF(cpf_cnpj)
        : quantidade_digitos === 14
            ? validarCNPJ(cpf_cnpj)
            : false;
    if (!documento_valido) {
        return res.status(400).json({MSG: "CPF ou CNPJ inválido. Confira o número informado."})
    }

    const existe_dado = await prisma.cliente.findFirst({
        where:{
            OR:[
                {email: email},
                {cpf: cpf_cnpj}
            ]
        }
    })
    if(existe_dado){
        return res.status(400).json({MSG: "CPF ou Email já cadastrado em outro cliente!"})
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