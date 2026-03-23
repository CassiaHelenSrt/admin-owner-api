import express from "express";
import clientRoutes from "./routes/client.routes";
import authRoutes from "./routes/auth.router";
import productRoute from "./routes/product.routes";

const app = express();

app.use(express.json());

app.use(authRoutes);

app.use("/clients", clientRoutes);
app.use("/product", productRoute);

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
