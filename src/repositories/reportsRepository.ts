import { prisma } from "../utils/prisma";

export type StatusAgg = { status: string; count: number };
export type PaymentAgg = { method: string; value: number };
export type WeeklyTicketAgg = { year: number; week: number; ticket: number };
export type DailyRevenueAgg = { y: number; m: number; d: number; revenue: number };
export type TopProductAgg = { name: string; quantity: number };

export const reportsRepository = {
    async countOrdersByMarket(marketId: string): Promise<number> {
        return prisma.order.count({ where: { marketId: marketId as any } });
    },

    async countPendingOrdersByMarket(marketId: string): Promise<number> {
        return prisma.order.count({
            where: { marketId: marketId as any, status: { in: ['PENDING', 'CONFIRMED', 'PREPARING'] as any } }
        });
    },

    async countProductsByMarket(marketId: string): Promise<number> {
        return prisma.product.count({ where: { marketId: marketId as any } });
    },

    async sumDeliveredRevenueByMarket(marketId: string): Promise<number> {
        const agg = await prisma.order.aggregateRaw({
            pipeline: [
                { $match: { marketId: { $oid: marketId }, status: 'DELIVERED' } },
                { $group: { _id: null, total: { $sum: '$total' } } },
                { $project: { _id: 0, total: 1 } }
            ]
        }) as unknown as Array<{ total: number }>;
        return Array.isArray(agg) && agg[0]?.total ? Number(agg[0].total) : 0;
    },

    async aggregateStatusByMarket(marketId: string): Promise<StatusAgg[]> {
        return await prisma.order.aggregateRaw({
            pipeline: [
                { $match: { marketId: { $oid: marketId } } },
                { $group: { _id: '$status', count: { $sum: 1 } } },
                { $project: { _id: 0, status: '$_id', count: 1 } }
            ]
        }) as unknown as StatusAgg[];
    },

    async aggregatePaymentRevenueByMarket(marketId: string): Promise<PaymentAgg[]> {
        return await prisma.order.aggregateRaw({
            pipeline: [
                { $match: { marketId: { $oid: marketId }, status: 'DELIVERED' } },
                { $group: { _id: '$paymentMethod', value: { $sum: '$total' } } },
                { $project: { _id: 0, method: '$_id', value: 1 } }
            ]
        }) as unknown as PaymentAgg[];
    },

    async aggregateWeeklyTicketByMarket(marketId: string): Promise<WeeklyTicketAgg[]> {
        return await prisma.order.aggregateRaw({
            pipeline: [
                { $match: { marketId: { $oid: marketId }, status: 'DELIVERED' } },
                {
                    $group: {
                        _id: {
                            y: { $isoWeekYear: '$createdAt' },
                            w: { $isoWeek: '$createdAt' }
                        },
                        sum: { $sum: '$total' },
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        year: '$_id.y',
                        week: '$_id.w',
                        ticket: { $cond: [{ $gt: ['$count', 0] }, { $divide: ['$sum', '$count'] }, 0] }
                    }
                },
                { $sort: { year: 1, week: 1 } }
            ]
        }) as unknown as WeeklyTicketAgg[];
    },

    async aggregateDailyRevenueByMarket(marketId: string, fromDate: Date): Promise<DailyRevenueAgg[]> {
        return await prisma.order.aggregateRaw({
            pipeline: [
                { $match: { marketId: { $oid: marketId }, status: 'DELIVERED', createdAt: { $gte: fromDate } } },
                {
                    $group: {
                        _id: {
                            y: { $year: '$createdAt' },
                            m: { $month: '$createdAt' },
                            d: { $dayOfMonth: '$createdAt' }
                        },
                        revenue: { $sum: '$total' }
                    }
                },
                { $project: { _id: 0, y: '$_id.y', m: '$_id.m', d: '$_id.d', revenue: 1 } },
                { $sort: { y: 1, m: 1, d: 1 } }
            ]
        }) as unknown as DailyRevenueAgg[];
    },

    async aggregateTopProductsByMarket(marketId: string, top: number): Promise<TopProductAgg[]> {
        return await prisma.orderItem.aggregateRaw({
            pipeline: [
                {
                    $lookup: {
                        from: 'Order',
                        localField: 'orderId',
                        foreignField: '_id',
                        as: 'order'
                    }
                },
                { $unwind: '$order' },
                { $match: { 'order.status': 'DELIVERED', 'order.marketId': { $oid: marketId } } },
                {
                    $group: {
                        _id: '$productId',
                        quantity: { $sum: '$quantity' }
                    }
                },
                { $sort: { quantity: -1 } },
                { $limit: top },
                {
                    $lookup: {
                        from: 'Product',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        _id: 0,
                        name: { $ifNull: ['$product.name', { $toString: '$_id' }] },
                        quantity: 1
                    }
                }
            ]
        }) as unknown as TopProductAgg[];
    }
};


