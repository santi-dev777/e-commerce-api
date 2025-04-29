import z from "zod";

export const categorySchema = z.object({
    name: z.string(),
    description: z.string().optional()
})

export function ValidateCategory (input) {
    return categorySchema.safeParse(input)
}

export function ValidatePartialCategory(input){
    return categorySchema.partial().safeParse(input)
}