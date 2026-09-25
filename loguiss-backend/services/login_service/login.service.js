import jwt from 'jsonwebtoken';
import { prisma } from '../../database.js';


const chave_jwt = process.env.CHAVE_JWT 

export async function login (req,res) {
    const {email , senha} = req.body

    if(!email || !senha){
        return res.status(400).json({MGS: "informa certo"})
    }

    try{
        const usuario_achado = await prisma.user.findFirst({
            where:{
                email:email,
                senha:senha
            }
        })
        if(!usuario_achado){
            return res.status(401).json({MSG: "Email ou senha inválidos"})
        }

        const usuario_email = usuario_achado.email
        const usuario_id = usuario_achado.id_user

        const token = jwt.sign({
            id: usuario_id,
            email: usuario_email
        },
            chave_jwt,
        {
            expiresIn: "1h"
        });

        return res.status(200).json({MSG: "Senha e email corretos!!", token: token})

    }catch(error){
        console.error(error);
        return res.status(500).json({error: 'Erro interno do servidor'});
    }

        
}