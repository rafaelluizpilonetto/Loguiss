import express from 'express';
import controller from '../controllers/controller_movimentacao/controller_movimentacao.js';

const router_movimentacao = express.Router();

router_movimentacao.post('/create_movi', (req, res) => {
    controller.create_movi(req, res);
});


export default router_movimentacao;