import z from "zod";

export const AddressDTO = z.object({
    name: z.string({ error: "Nome do endereço é obrigatório" }),
    street: z.string({ error: "Rua do endereço é obrigatório" }),
    number: z.string({ error: "Número do endereço é obrigatório" }),
    neighborhood: z.string({ error: "Bairro do endereço é obrigatório" }),
    city: z.string({ error: "Cidade do endereço é obrigatório" }),
    state: z.string({ error: "Estado do endereço é obrigatório" }),
    zipCode: z.string({ error: "CEP do endereço é obrigatório" }),
    complement: z.string().optional(),
    isFavorite: z.boolean().optional(),
    isActive: z.boolean().optional(),
    latitude: z.number({ error: "Latitude do endereço deve ser numérica" }).optional(),
    longitude: z.number({ error: "Longitude do endereço deve ser numérica" }).optional(),
});

export type AddressDTO = z.infer<typeof AddressDTO>;

export const AddressUpdateDTO = AddressDTO.partial();
export type AddressUpdateDTO = z.infer<typeof AddressUpdateDTO>;