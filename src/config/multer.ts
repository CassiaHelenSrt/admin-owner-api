import multer from "multer";
import * as path from "path";
import * as fs from "fs";

// Função mágica que cria a pasta que você pedir e configura o Multer
export const createUploadMiddleware = (folderName: string) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            // Define o caminho final baseado na pasta que você escolheu (ex: uploads/clients)
            const targetPath = path.resolve(
                __dirname,
                `../../uploads/${folderName}`,
            );

            // Se a pasta não existir, o Node cria ela na hora automaticamente
            if (!fs.existsSync(targetPath)) {
                fs.mkdirSync(targetPath, { recursive: true });
            }

            cb(null, targetPath);
        },
        filename: (req, file, cb) => {
            // Gera o nome único seguro
            const uniqueSuffix =
                Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        },
    });

    // Devolve o multer configurado focado em apenas 1 foto por vez
    // O nome do campo no Insomnia/Front-end sempre será 'photo'
    return multer({ storage }).single("photo");
};

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         // Encontra a pasta uploads na raiz do projeto
//         cb(null, path.resolve(__dirname, "../../uploads/clients"));
//     },
//     filename: (req, file, cb) => {
//         // Cria um nome seguro com número aleatório + extensão (.jpg, .png)
//         const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//         cb(null, uniqueSuffix + path.extname(file.originalname));
//     },
// });

// const upload = multer({ storage: storage });
