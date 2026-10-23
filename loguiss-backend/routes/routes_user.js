import express from 'express';
import controller from '../controllers/controller_user/controller_user.js';

const router_user = express.Router();

router_user.post('/create_user', (req, res) => {
    controller.create_user(req, res)
})
router_user.patch('/edit_user/:id_user', (req, res)=> {
    controller.edit_user(req, res)
})
router_user.get('/list_user', (req, res)=>{
    controller.list_user(req, res)
})

export default router_user