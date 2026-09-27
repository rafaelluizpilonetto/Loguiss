import { prisma } from "../../database.js";

export async function list_cliente_service(req, res) {
    try {
        const clientes = prisma.cliente.findMany({})
        if(!clientes){
            return res.status(400).json({MSG: "Nenhum cliente encontrado!"})
        }
        return res.status(200).json({MSG: "Clientes encontrados!", Clientes: clientes})
    } catch (error) {
        console.log(error)
    }
}