import express from 'express';
import controller from '../controllers/controller_fornecedor/controller_fornecedor.js'

const router_fornecedor = express.Router();

router_fornecedor.post('/create_fornecedor', (req, res)=> {
    controller.create_fornecedor(req, res);   
})
router_fornecedor.get('/list_fornecedor', (req, res) =>{
    controller.list_fornecedor(req, res);
})
router_fornecedor.patch('/edit_fornecedor/:id_fornecedor', (req, res)=>{
    controller.edit_fornecedor(req, res)
})

export default router_fornecedor;