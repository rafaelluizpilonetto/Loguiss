import { prisma } from "../../database.js"


export default async function cadastro_user_service(req, res) {
    const {
        nome,
        email,
        senha,
        confirmar_senha,
        telefone,
        cpf,
        tipo_user
    } = req.body
    if (!nome || !email || !senha || !confirmar_senha || !telefone || !cpf || !tipo_user) {
        return res.status(400).json({MSG: "Favor revisar dados mandados, algo está faltando"})
    }

    // Validação se existe email
    try {
        const email_existe = await prisma.user.findUnique({
            where:{
                email: email
            }
        })
        if(email_existe){
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
        if(cpf_existe){
            return res.status(400).json({MSG: "CPF já cadastrado!, favor inserir um válido"})
        }
    } catch (error) {
        console.log("problema ao achar cpf: \n", error)
    }

    try {

        const cadastro_user = await prisma.$transaction( async (pris)=>{
            const user = await pris.user.create({
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
            
            const cod_verify = await pris.verificacao_user.create({
                data:{
                    id_user: user.id_user
                }
            })

        })
        
        return res.status(200).json({MSG: "Usuário cadastrado com sucesso!", user: cadastro_user})

    } catch (error) {
        console.log("problema no cadastro: \n", error)
    }








}
