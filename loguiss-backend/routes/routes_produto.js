import express from 'express';
import controller from '../controllers/controllers_produto/controller_produto.js';

const router_produto = express.Router();

router_produto.post('/create_produto', (req, res)=>{
    controller.create_produto(req, res);
})
router_produto.get('/list_produtos', (req, res) => {
    controller.list_produto(req, res)
})
router_produto.delete('/delete_produto/:id_produto', (req, res) => {
    controller.delete_produto(req, res)
});
router_produto.patch('/edit_produto/:id_produto', (req, res) => {
    controller.edit_produto(req, res)
});


export default router_produto