import { Logger } from "../utils/logger";
import { reportsRepository } from "../repositories/reportsRepository";

type ReportsSummaryParams = {
    marketId: string;
    days?: number;   // for daily revenue window
    weeks?: number;  // for weekly ticket window
    top?: number;    // for top products
};

type ReportsSummary = {
    statusData: Array<{ status: string; pedidos: number }>;
    paymentData: Array<{ method: string; value: number }>;
    weeklyTicketData: Array<{ semana: string; ticket: number }>;
    revenueDailyData: Array<{ date: string; revenue: number }>;
    topProductsData: Array<{ name: string; quantity: number }>;
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    totalProducts: number;
};

function mapStatusToPtBr(status: string): string {
    switch (status) {
        case 'DELIVERED': return 'Entregues';
        case 'PREPARING': return 'Preparando';
        case 'CONFIRMED': return 'Confirmados';
        case 'PENDING': return 'Pendentes';
        case 'CANCELLED': return 'Cancelados';
        case 'READY_FOR_DELIVERY': return 'Pronto para entrega';
        case 'OUT_FOR_DELIVERY': return 'Saiu para entrega';
        default: return status;
    }
}

function mapPaymentToPtBr(method: string): string {
    switch (method) {
        case 'CREDIT_CARD': return 'Crédito';
        case 'DEBIT_CARD': return 'Débito';
        case 'PIX': return 'PIX';
        case 'CASH': return 'Dinheiro';
        default: return 'Outro';
    }
}

export const reportsService = {
    async getSummary(params: ReportsSummaryParams): Promise<ReportsSummary> {
        const marketId = params.marketId;
        const days = Math.max(1, Math.min(params.days ?? 30, 90));
        const weeks = Math.max(1, Math.min(params.weeks ?? 6, 26));
        const top = Math.max(1, Math.min(params.top ?? 5, 20));

        const [totalOrders, pendingOrders, totalProducts, totalRevenue] = await Promise.all([
            reportsRepository.countOrdersByMarket(marketId),
            reportsRepository.countPendingOrdersByMarket(marketId),
            reportsRepository.countProductsByMarket(marketId),
            reportsRepository.sumDeliveredRevenueByMarket(marketId),
        ]);

        const statusAgg = await reportsRepository.aggregateStatusByMarket(marketId);
        const statusData = statusAgg.map(s => {
            const label = mapStatusToPtBr(s.status);
            const fill = `var(--color-${label})`;
            return { status: label, pedidos: Number(s.count), fill };
        });

        const paymentAgg = await reportsRepository.aggregatePaymentRevenueByMarket(marketId);
        const paymentData = paymentAgg.map(p => ({ method: mapPaymentToPtBr(p.method), value: Number(p.value) }));

        const weeklyAgg = await reportsRepository.aggregateWeeklyTicketByMarket(marketId);
        const lastWeeks = weeklyAgg.slice(-weeks);
        const weeklyTicketData = lastWeeks.map(w => ({
            semana: `Sem ${String(w.week).padStart(2, '0')}/${String(w.year).slice(-2)}`,
            ticket: Number(w.ticket || 0)
        }));

        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - (days - 1));
        const dailyAgg = await reportsRepository.aggregateDailyRevenueByMarket(marketId, fromDate);
        const map = new Map<string, number>();
        for (const r of dailyAgg) {
            const date = new Date(Date.UTC(r.y, r.m - 1, r.d));
            const key = date.toISOString().slice(0, 10);
            map.set(key, Number(r.revenue || 0));
        }
        const revenueDailyData: Array<{ date: string; revenue: number }> = [];
        for (let i = 0; i < days; i++) {
            const d = new Date(fromDate);
            d.setDate(fromDate.getDate() + i);
            const key = d.toISOString().slice(0, 10);
            const label = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
            revenueDailyData.push({ date: label, revenue: map.get(key) || 0 });
        }

        const topProductsAgg = await reportsRepository.aggregateTopProductsByMarket(marketId, top);
        const topProductsData = topProductsAgg.map(p => ({ name: p.name, quantity: Number(p.quantity || 0) }));

        return {
            statusData,
            paymentData,
            weeklyTicketData,
            revenueDailyData,
            topProductsData,
            totalOrders,
            pendingOrders,
            totalRevenue,
            totalProducts,
        };
    }
};


