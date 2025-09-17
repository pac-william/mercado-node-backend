import { Request, Response } from "express";
import { couponService } from "../services/couponService";
import { Logger } from "../utils/logger";
import { QueryBuilder } from "../utils/queryBuilder";
import { CouponDTO, CouponUpdateDTO, toCouponResponseDTO } from "../dtos/couponDTO";

export class CouponController {
    async createCoupon(req: Request, res: Response) {
        Logger.controller('Coupon', 'createCoupon', 'request received', req.body);
        try {
            const data: CouponDTO = req.body;
            const coupon = await couponService.createCoupon(data);
            Logger.successOperation('CouponController', 'createCoupon');
            return res.status(201).json(toCouponResponseDTO(coupon));
        } catch (error) {
            Logger.errorOperation('CouponController', 'createCoupon', error);
            if (error instanceof Error && error.message.includes("Já existe um cupom")) {
                return res.status(409).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async getCoupons(req: Request, res: Response) {
        Logger.controller('Coupon', 'getCoupons', 'query', req.query);
        try {
            const { page, size, marketId, isActive } = QueryBuilder.from(req.query)
                .withNumber('page', 1)
                .withNumber('size', 10)
                .withString('marketId')
                .withBoolean('isActive')
                .build();

            const result = await couponService.getCoupons(page, size, marketId, isActive);
            Logger.successOperation('CouponController', 'getCoupons');
            return res.status(200).json({
                coupons: result.coupons.map(toCouponResponseDTO),
                meta: {
                    page,
                    size,
                    total: result.count,
                    totalPages: Math.ceil(result.count / size),
                    count: result.count
                }
            });
        } catch (error) {
            Logger.errorOperation('CouponController', 'getCoupons', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async getCouponById(req: Request, res: Response) {
        Logger.controller('Coupon', 'getCouponById', 'params', req.params);
        try {
            const { id } = req.params;
            const coupon = await couponService.getCouponById(id);
            Logger.successOperation('CouponController', 'getCouponById');
            return res.status(200).json(toCouponResponseDTO(coupon));
        } catch (error) {
            Logger.errorOperation('CouponController', 'getCouponById', error);
            if (error instanceof Error && error.message === "Cupom não encontrado") {
                return res.status(404).json({ message: "Cupom não encontrado" });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async updateCoupon(req: Request, res: Response) {
        Logger.controller('Coupon', 'updateCoupon', 'request received', { params: req.params, body: req.body });
        try {
            const { id } = req.params;
            const data: CouponUpdateDTO = req.body;
            const coupon = await couponService.updateCoupon(id, data);
            Logger.successOperation('CouponController', 'updateCoupon');
            return res.status(200).json(toCouponResponseDTO(coupon));
        } catch (error) {
            Logger.errorOperation('CouponController', 'updateCoupon', error);
            if (error instanceof Error && error.message === "Cupom não encontrado") {
                return res.status(404).json({ message: "Cupom não encontrado" });
            }
            if (error instanceof Error && error.message.includes("Já existe um cupom")) {
                return res.status(409).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async deleteCoupon(req: Request, res: Response) {
        Logger.controller('Coupon', 'deleteCoupon', 'params', req.params);
        try {
            const { id } = req.params;
            await couponService.deleteCoupon(id);
            Logger.successOperation('CouponController', 'deleteCoupon');
            return res.status(204).send();
        } catch (error) {
            Logger.errorOperation('CouponController', 'deleteCoupon', error);
            if (error instanceof Error && error.message === "Cupom não encontrado") {
                return res.status(404).json({ message: "Cupom não encontrado" });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async validateCoupon(req: Request, res: Response) {
        Logger.controller('Coupon', 'validateCoupon', 'request received', req.body);
        try {
            const { code, orderValue, marketId } = req.body;
            const result = await couponService.calculateDiscount(code, orderValue, marketId);
            Logger.successOperation('CouponController', 'validateCoupon');
            return res.status(200).json({
                valid: true,
                coupon: toCouponResponseDTO(result.coupon),
                discount: result.discount,
                finalValue: result.finalValue
            });
        } catch (error) {
            Logger.errorOperation('CouponController', 'validateCoupon', error);
            return res.status(400).json({ 
                valid: false,
                message: error instanceof Error ? error.message : "Erro ao validar cupom"
            });
        }
    }
}

export const couponController = new CouponController(); 