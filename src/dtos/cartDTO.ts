import { z } from 'zod';
import { CartItemResponseDTO, CreateCartItemDTO } from './cartItemDTO';

// Schema para adicionar múltiplos itens ao carrinho
export const addMultipleItemsSchema = z.object({
  items: z.array(CreateCartItemDTO).min(1, 'Pelo menos um item deve ser fornecido'),
});

export const createCartSchema = z.object({
  marketId: z.string().min(1, 'marketId é obrigatório'),
});

// Schema de resposta para Cart
export const cartResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  marketId: z.string(),
  marketName: z.string().optional(),
  items: z.array(CartItemResponseDTO),
  totalItems: z.number(),
  totalValue: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Tipos TypeScript
export type { CartItemResponseDTO, CreateCartItemDTO, UpdateCartItemDTO } from './cartItemDTO';
export type AddMultipleItemsDTO = z.infer<typeof addMultipleItemsSchema>;
export type CreateCartDTO = z.infer<typeof createCartSchema>;
export type CartResponseDTO = z.infer<typeof cartResponseSchema>;