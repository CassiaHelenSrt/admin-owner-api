export interface CreateProductDTO {
    name: string;
    type: string;
    price: number;
    duration: number;
    description?: string;
    photo?: string;
}

export interface UpdateProductDTO {
    name?: string;
    type?: string;
    price?: number;
    duration?: number;
    description?: string;
    photo?: string;
}
