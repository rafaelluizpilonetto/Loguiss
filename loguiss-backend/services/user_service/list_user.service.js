import { prisma } from "../../database.js";

export default async function list_user_service(req, res) {
    try {
        const users = await prisma.user.findMany({})
        if(!users){
            return res.status(400).json({MSG: "nenhum usuário encontrado!"})
        }
        return res.status(200).json({MSG: "usuários encontrados!", users: users})
        
    } catch (error) {
        return req.status(500).json({MSG: "erro na listagem de usuários", erro: error})
    }    
}