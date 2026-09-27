import create_fornecedor_service from "../../services/fornecedor_service/create_fornecedor.service.js";
import { edit_fornecedor_service } from "../../services/fornecedor_service/edit_fornecedor.service.js";
import list_fornecedor_service from "../../services/fornecedor_service/list_fornecedo.service.js";


async function create_fornecedor(req, res) {
    await create_fornecedor_service(req, res);   
}
async function list_fornecedor(req, res) {
    await list_fornecedor_service(req, res);
}
async function edit_fornecedor(req, res) {
    await edit_fornecedor_service(req,res)
}

export default {create_fornecedor, list_fornecedor, edit_fornecedor}