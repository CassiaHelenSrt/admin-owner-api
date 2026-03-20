import express from "express";
import clientRoutes from "./routes/client.routes";
import authRoutes from "./routes/auth.router";

const app = express();

app.use(express.json());

app.use(authRoutes);

app.use("/clients", clientRoutes);

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
