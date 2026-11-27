import { prisma } from "../../database.js";
import { validarCPF } from "../../utils/validacoes.js";

export default async function edit_user_service(req, res) {
    const {
        nome,
        email,
        senha,
        confirmar_senha,
        telefone,
        cpf,
        tipo_user
    } = req.body
    const id_user = req.params.id_user

    if (!validarCPF(cpf)) {
        return res.status(400).json({MSG: "CPF inválido. Confira o número informado."})
    }

    try {

        if(senha != confirmar_senha){
            return res.status(400).json({MSG: "Senhas não são iguais! favor verificar!"})
        }

        const email_existe = await prisma.user.findUnique({
            where:{
                email: email
            }
        })
        if(email_existe && email != email_existe.email){
            return res.status(400).json({MSG: "email já existe! favor inserir um válido"})
        }
    } catch (error) {
        console.log("problema ao achar email: \n",error)
    }

    // Validação se existe cpf
    try {
        const cpf_existe = await prisma.user.findUnique({
            where:{
                cpf: cpf
            }
        })
        if(cpf_existe && cpf != cpf_existe.cpf){
            return res.status(400).json({MSG: "CPF já cadastrado!, favor inserir um válido"})
        }
    } catch (error) {
        console.log("problema ao achar cpf: \n", error)
    }

    try {

        const edit_user = await prisma.$transaction( async (pris) =>{
            const user = await pris.user.update({
                where:{
                    id_user: Number(id_user)
                },
                data:{
                    nome_usuario: nome,
                    email: email,
                    senha: senha,
                    cpf: cpf,
                    telefone: telefone,
                    tipo_user: tipo_user,
                    senha_pdv: senha                
                }
            })


        })
        return res.status(200).json({MSG: "usuário editado com sucesso!", user: edit_user})
    } catch (error) {
        console.log("erro ao editar usuário", error)
    }



}