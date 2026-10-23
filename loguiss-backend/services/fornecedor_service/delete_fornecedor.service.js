import { prisma } from "../../database.js";

export async function delete_fornecedor_service(req, res) {
    const id_fornecedor = req.params

    try {
        const existe_fornecedor = await prisma.fornecedor.findUnique({
            where:{
                id_fornecedor: Number(id_fornecedor)
            }
        }) 
        if(!existe_fornecedor){
            return res.status(400).json({MSG: "Fornecedor não encontrado ou não existe! favor verificar!"})
        }

        const delete_fornecedor = prisma.$transaction( async (pris)=>{
            const delete_endereco = pris.endereco.delete({
                where:{
                    id_fornecedor: Number(id_fornecedor)
                }
            })

            const fornecedor = pris.fornecedor.delete({
                where:{
                    id_fornecedor: Number(id_fornecedor)
                }
            })

        })
        return res.status(200).json({MSG:"Fornecedor deetado com sucesso!", fornecedor: delete_fornecedor})

    } catch (error) {
        console.log(error)
    }

}