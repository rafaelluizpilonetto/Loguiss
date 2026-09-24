import express from "express";
import cors from "cors";
import router_login from './routes/routes_login.js';
import router_categoria from './routes/routes_categoria.js';
import router_receita from './routes/routes_receita.js';
import router_produto from './routes/routes_produto.js';
import router_fornecedor from './routes/routes_fornecedor.js';
import router_unidade_medida from './routes/routes_unidade_medida.js';



const app = express();

app.use(cors({
    origin: [
        process.env.FRONT_URL,
        'https://loguiss.vercel.app'
    ]
}));

app.use(express.json());

app.use("/login", router_login);
app.use("/categoria", router_categoria);
app.use("/receita", router_receita);
app.use("/produto", router_produto);
app.use("/fornecedor", router_fornecedor);
app.use("/unidade_medida", router_unidade_medida);


app.get("/", (req, res) => {
    res.json({
        mensagem: "API Loguiss funcionando!"
    });
});

export default app;
