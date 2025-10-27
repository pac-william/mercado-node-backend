import { z } from 'zod';

export const CreateCartItemDTO = z.object({
  productId: z.string({ message: "ID do produto é obrigatório" }),
  quantity: z.number().int().positive({ message: "Quantidade deve ser um número inteiro positivo" }),
});

export type CreateCartItemDTO = z.infer<typeof CreateCartItemDTO>;

export const UpdateCartItemDTO = z.object({
  quantity: z.number().int().positive({ message: "Quantidade deve ser um número inteiro positivo" }),
});

export type UpdateCartItemDTO = z.infer<typeof UpdateCartItemDTO>;

export const CartItemResponseDTO = z.object({
  id: z.string(),
  productId: z.string(),
  quantity: z.number(),
  product: z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    unit: z.string(),
    image: z.string().nullable(),
    marketId: z.string(),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CartItemResponseDTO = z.infer<typeof CartItemResponseDTO>;
