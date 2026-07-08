import { UserRole } from "../entities/User";

export interface AuthTokenPayload {
    id: number;
    role: UserRole;
}
