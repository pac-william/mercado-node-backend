import { z } from "zod";

// Validação de formato de hora HH:mm
const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;

// Schema base que aceita ambos os formatos (frontend e backend) - SEM transform ainda
const BaseMarketOperatingHoursSchemaInput = z.object({
    marketId: z.string().min(1, { message: "ID do mercado é obrigatório" }),
    dayOfWeek: z.number().int().min(0).max(6).optional().nullable(), // 0-6 (Domingo-Sábado)
    // Aceita tanto startTime/endTime quanto openTime/closeTime
    startTime: z.string().regex(timeRegex, { message: "Horário de início deve estar no formato HH:mm" }).optional(),
    endTime: z.string().regex(timeRegex, { message: "Horário de fim deve estar no formato HH:mm" }).optional(),
    openTime: z.string().regex(timeRegex, { message: "Horário de abertura deve estar no formato HH:mm" }).optional(),
    closeTime: z.string().regex(timeRegex, { message: "Horário de fechamento deve estar no formato HH:mm" }).optional(),
    // Aceita tanto isHoliday quanto detecta automaticamente por holidayDate
    isHoliday: z.boolean().optional(),
    holidayDate: z.union([z.coerce.date(), z.string()]).optional().nullable(), // Data do feriado (aceita string ou Date)
    // Aceita tanto isClosed quanto isOpen (são inversos)
    isClosed: z.boolean().optional(),
    isOpen: z.boolean().optional(),
});

// Schema para update (partial, sem marketId) - antes do transform
const BaseMarketOperatingHoursUpdateSchemaInput = BaseMarketOperatingHoursSchemaInput.partial().omit({ marketId: true });

// Schema para bulk (sem marketId no item) - antes do transform
const BaseMarketOperatingHoursItemSchemaInput = BaseMarketOperatingHoursSchemaInput.omit({ marketId: true });

// Função de transformação reutilizável
const transformOperatingHours = (data: z.infer<typeof BaseMarketOperatingHoursSchemaInput>) => {
    // Normaliza os dados para o formato interno do backend
    
    // 3. Converte isOpen para isClosed (são inversos) - precisa fazer antes para usar na lógica de horários
    let isClosed = data.isClosed;
    if (data.isOpen !== undefined) {
        isClosed = !data.isOpen;
    }
    if (isClosed === undefined) {
        isClosed = false; // Default: aberto
    }
    
    // 2. Detecta se é feriado (se tem holidayDate, é feriado)
    const isHoliday = data.isHoliday ?? (data.holidayDate !== null && data.holidayDate !== undefined);
    
    // 4. Normaliza holidayDate
    let holidayDate: Date | null = null;
    if (data.holidayDate) {
        holidayDate = data.holidayDate instanceof Date ? data.holidayDate : new Date(data.holidayDate);
    }
    
    // Se é feriado, dayOfWeek deve ser null (não importa o que foi enviado)
    // Se não é feriado, dayOfWeek deve ser o valor enviado
    const dayOfWeek = isHoliday ? null : (data.dayOfWeek ?? null);
    
    // 1. Converte openTime/closeTime para startTime/endTime se necessário
    // Se está fechado, usa horários padrão (serão ignorados)
    const startTime = data.startTime || data.openTime || (isClosed ? "00:00" : "08:00");
    const endTime = data.endTime || data.closeTime || (isClosed ? "00:00" : "18:00");
    
    return {
        marketId: data.marketId || "",
        dayOfWeek,
        startTime,
        endTime,
        isHoliday,
        holidayDate,
        isClosed,
    };
};

// Schema completo com transform e validações
const BaseMarketOperatingHoursSchema = BaseMarketOperatingHoursSchemaInput.transform(transformOperatingHours)
    // Validação para feriados
    .refine((data) => {
        if (data.isHoliday && !data.holidayDate) {
            return false;
        }
        return true;
    }, {
        message: "Feriados devem ter uma data (holidayDate)."
    })
    // Validação para feriados não devem ter dayOfWeek
    .refine((data) => {
        if (data.isHoliday && data.dayOfWeek !== null) {
            return false;
        }
        return true;
    }, {
        message: "Feriados não devem ter dayOfWeek. Remova o campo dayOfWeek ao criar um feriado."
    })
    // Validação para horários regulares devem ter dayOfWeek
    .refine((data) => {
        if (!data.isHoliday && (data.dayOfWeek === null || data.dayOfWeek === undefined)) {
            return false;
        }
        return true;
    }, {
        message: "Horários regulares devem ter um dayOfWeek válido (0-6, onde 0=Domingo, 6=Sábado)."
    })
    // Validação para dayOfWeek deve estar entre 0 e 6
    .refine((data) => {
        if (!data.isHoliday && (typeof data.dayOfWeek !== 'number' || data.dayOfWeek < 0 || data.dayOfWeek > 6)) {
            return false;
        }
        return true;
    }, {
        message: "dayOfWeek deve ser um número entre 0 e 6 (0=Domingo, 6=Sábado)."
    }).refine((data) => {
    // Se está fechado, não precisa validar horários
    if (data.isClosed) {
        return true;
    }
    // Validar que horário de fim é depois do horário de início
    const [startHour, startMinute] = data.startTime.split(':').map(Number);
    const [endHour, endMinute] = data.endTime.split(':').map(Number);
    const startTotal = startHour * 60 + startMinute;
    const endTotal = endHour * 60 + endMinute;
    return endTotal > startTotal;
}, {
    message: "Horário de fim deve ser posterior ao horário de início"
});

export const MarketOperatingHoursDTOSchema = BaseMarketOperatingHoursSchema;

export type MarketOperatingHoursDTO = z.input<typeof MarketOperatingHoursDTOSchema>;
export type MarketOperatingHoursDTOOutput = z.output<typeof MarketOperatingHoursDTOSchema>;

// Schema para update - aplica transform manualmente já que é partial
export const MarketOperatingHoursUpdateDTOSchema = BaseMarketOperatingHoursUpdateSchemaInput.transform((data) => {
    // Para update, marketId pode não estar presente, então usa string vazia
    return transformOperatingHours({ ...data, marketId: "" });
});

export type MarketOperatingHoursUpdateDTO = z.input<typeof MarketOperatingHoursUpdateDTOSchema>;
export type MarketOperatingHoursUpdateDTOOutput = z.output<typeof MarketOperatingHoursUpdateDTOSchema>;

// Schema para item de bulk (sem marketId)
const MarketOperatingHoursItemSchema = BaseMarketOperatingHoursItemSchemaInput.transform((data) => {
    // Para item de bulk, marketId não está presente, então usa string vazia
    return transformOperatingHours({ ...data, marketId: "" });
});

// DTO para criar múltiplos horários de uma vez
export const BulkMarketOperatingHoursDTOSchema = z.object({
    marketId: z.string().min(1, { message: "ID do mercado é obrigatório" }),
    hours: z.array(BaseMarketOperatingHoursItemSchemaInput).min(1, { message: "Deve haver pelo menos um horário" })
}).transform((data) => {
    // Transforma cada item do array e adiciona o marketId
    return {
        marketId: data.marketId,
        hours: data.hours.map(hour => transformOperatingHours({ ...hour, marketId: data.marketId }))
    };
});

export type BulkMarketOperatingHoursDTO = z.input<typeof BulkMarketOperatingHoursDTOSchema>;
export type BulkMarketOperatingHoursDTOOutput = z.output<typeof BulkMarketOperatingHoursDTOSchema>;

