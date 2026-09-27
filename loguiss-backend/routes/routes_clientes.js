import express from 'express';
import controller from '../controllers/controller_cliente/controller_cliente.js'

const router_cliente = express.Router();

router_cliente.post('/create_cliente', (req, res)=> {
    controller.create_cliente(req, res);   
})
router_cliente.patch('/edit_cliente', (req, res) =>{
    controller.edit_cliente(req, res);
})
router_cliente.get('/list_clientes', (req, res) =>{
    controller.list_clientes(req, res);
})

export default router_cliente;