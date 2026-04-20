import "reflect-metadata";
import "dotenv/config";
import cors from "cors";

import express from "express";
import clientRoutes from "./routes/client.routes";
import authRoutes from "./routes/auth.router";
import productRoute from "./routes/product.routes";
import createSchedule from "./routes/schedule.router";
import { AppDataSource } from "./config/data-source";
import availabilityRoutes from "./routes/availability.routes";

const app = express();

app.use(cors());

app.use(express.json());

app.use(authRoutes);

app.use("/client", clientRoutes);
app.use("/product", productRoute);
app.use("/schedules", createSchedule);
app.use("/availability", availabilityRoutes);

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
