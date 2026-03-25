// import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Client } from "../entities/Client";
import { Product } from "../entities/Product";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "123456",
    database: "beauty_management_system",
    synchronize: true, // cria tabelas automaticamente (bom pra dev)
    logging: false,
    entities: [User, Client, Product], // onde ficarão suas classes (entidades)
});
