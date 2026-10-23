import {create_cliente_service} from "../../services/cliente_service/create_cliente.service.js";
import {edit_cliente_service} from "../../services/cliente_service/edit_cliente.service.js";
import { list_cliente_service } from "../../services/cliente_service/list_cliente.service.js";


async function edit_cliente(req,res) {
    await edit_cliente_service(req, res);
}
async function create_cliente(req, res) {
    await create_cliente_service(req, res);
}
async function list_clientes(req, res) {
    await list_cliente_service(req, res);
}

export default {edit_cliente, create_cliente, list_clientes}