import jwt from "jsonwebtoken";

const SECRET_KEY = "3fa38e665f28951d5f4e4706770cf0465f0c901a";

const users = [
    { id: 1, username: "admin", password: "123456", role: "admin" },
    { id: 2, username: "cassia", password: "123456", role: "user" },
];

export class AuthService {
    login(username: string, password: string) {
        const user = users.find(
            (u) => u.username === username && u.password === password,
        );

        if (!user) {
            throw new Error("Usuário ou senha inválidos");
        }

        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                role: user.role,
            },
            SECRET_KEY,
            { expiresIn: "1h" },
        );

        return { token };
    }
}
