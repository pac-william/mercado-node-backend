import { Request, Response } from "express";
import { reportsService } from "../services/reportsService";
import { Logger } from "../utils/logger";

export class ReportsController {
    async getMarketSummary(req: Request, res: Response) {
        try {
            const { marketId } = req.params as { marketId: string };
            const days = req.query.days ? Number(req.query.days) : undefined;
            const weeks = req.query.weeks ? Number(req.query.weeks) : undefined;
            const top = req.query.top ? Number(req.query.top) : undefined;

            if (!marketId) {
                return res.status(400).json({ message: "marketId é obrigatório" });
            }

            const summary = await reportsService.getSummary({ marketId, days, weeks, top });
            return res.status(200).json(summary);
        } catch (error: any) {
            return res.status(500).json({ message: "Erro ao gerar relatórios" });
        }
    }
}


