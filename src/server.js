// ============================
//  Dependências
// ============================
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import usuariosRoutes from "./routes/usuarios.routes.js"
import livrosRoutes from "./routes/livros.routes.js"
import avaliacoesRoutes from "./routes/avaliacoes.routes.js"

// ============================
//  Configuração do servidor
// ============================
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.get("/", (req ,res ) => {
    res.json({msg :"API funcionando"})
});

app.use("/usuarios", usuariosRoutes);


app.use("/livros", livrosRoutes);

app.use("/avaliacoes", avaliacoesRoutes);

// ============================
//  Inicia o servidor
// ============================
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
