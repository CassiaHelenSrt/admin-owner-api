export interface CreateClientDTO {
    name: string;
    email: string;
    phone: string;
    photo?: string;
}

export interface UpdateClientDTO {
    name?: string;
    email?: string;
    phone?: string;
    photo?: string;
}
