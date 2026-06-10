import "reflect-metadata";
import "dotenv/config";
import cors from "cors";

import express from "express";
import clientRoutes from "./routes/client.routes";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import scheduleRoutes from "./routes/schedule.routes";
import { AppDataSource } from "./config/data-source";
import availabilityRoutes from "./routes/availability.routes";
import path from "path";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(authRoutes);
app.use("/client", clientRoutes);
app.use("/product", productRoutes);
app.use("/schedules", scheduleRoutes);
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
