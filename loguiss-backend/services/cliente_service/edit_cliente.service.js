import { prisma } from "../../database.js";
import { validarCNPJ, validarCPF } from "../../utils/validacoes.js";

export async function edit_cliente_service(req, res) {
    const{
        nome_cliente,
        email,
        cpf_cnpj,
        telefone

    } = req.body

    const id_cliente = req.params.id_cliente;
    const quantidade_digitos = String(cpf_cnpj ?? '').replace(/[^A-Z0-9]/gi, '').length
    const documento_valido = quantidade_digitos === 11
        ? validarCPF(cpf_cnpj)
        : quantidade_digitos === 14
            ? validarCNPJ(cpf_cnpj)
            : false;
    if (!documento_valido) {
        return res.status(400).json({MSG: "CPF ou CNPJ inválido. Confira o número informado."})
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