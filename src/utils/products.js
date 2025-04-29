import z from "zod";

export const productSchema = z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    stock: z.number(),
    image_url: z.string().nullable().optional(),
    categories: z.array(z.number()).optional()

})

export function ValidateProduct (input) {
    return productSchema.safeParse(input)
}

export function ValidatePartialProduct (input) {
    return productSchema.partial().safeParse(input)
}