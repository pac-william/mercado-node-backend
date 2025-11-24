import { z } from "zod";

export const SuggestionCreateDTO = z.object({
    userId: z.string({ message: "ID do usuário é obrigatório" }).min(1, { message: "ID do usuário é obrigatório" }),
    task: z.string({ message: "Tarefa é obrigatória" }).min(1, { message: "Tarefa é obrigatória" }),
});

export type SuggestionCreateDTO = z.infer<typeof SuggestionCreateDTO>;

export type SuggestionResponseDTO = {
    id: string;
    userId: string;
    task: string;
    data: any;
    createdAt: Date;
    updatedAt: Date;
};

export const toSuggestionResponseDTO = (s: any): SuggestionResponseDTO => ({
    id: String(s.id),
    userId: String(s.userId),
    task: s.task,
    data: s.data,
    createdAt: s.createdAt instanceof Date ? s.createdAt : new Date(s.createdAt),
    updatedAt: s.updatedAt instanceof Date ? s.updatedAt : new Date(s.updatedAt),
});
