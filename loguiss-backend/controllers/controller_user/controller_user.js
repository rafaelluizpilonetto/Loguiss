import cadastro_user_service from "../../services/user_service/cadastro_user.service.js";
import edit_user_service from "../../services/user_service/edit_user.service.js";
import list_user_service from "../../services/user_service/list_user.service.js";



async function create_user(req, res) {
    await cadastro_user_service(req, res)   
}
async function edit_user(req, res) {
    await edit_user_service(req, res)
}
async function list_user(req, res) {
    await list_user_service(req, res)
}

export default {create_user, edit_user, list_user}