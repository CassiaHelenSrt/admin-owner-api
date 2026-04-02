import "reflect-metadata";
import "dotenv/config";

import express from "express";
import clientRoutes from "./routes/client.routes";
import authRoutes from "./routes/auth.router";
import productRoute from "./routes/product.routes";
import createSchedule from "./routes/schedule.router";
import { AppDataSource } from "./config/data-source";

const app = express();

app.use(express.json());

app.use(authRoutes);

app.use("/client", clientRoutes);
app.use("/product", productRoute);
app.use("/schedules", createSchedule);

AppDataSource.initialize()
    .then(() => {
        console.log("Conectado ao MySQL!");

        app.listen(3000, () => {
            console.log("Servidor rodando na porta 3000");
        });
    })
    .catch((error) => {
        console.error("Erro ao conectar no banco:", error);
    });
