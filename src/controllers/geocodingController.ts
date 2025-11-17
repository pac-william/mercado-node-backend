import { Request, Response } from "express";
import { GeocodeDTO, GeocodeReverseDTO } from "../dtos/geocodingDTO";
import { geocodingService } from "../services/geocodingService";
import { Logger } from "../utils/logger";

export class GeocodingController {
    async geocode(req: Request, res: Response) {
        try {
            let data: GeocodeDTO;
            if (req.query.address) {
                data = GeocodeDTO.parse({ address: req.query.address });
            } else if (req.body.address) {
                data = GeocodeDTO.parse(req.body);
            } else {
                return res.status(400).json({ message: "Parâmetro 'address' é obrigatório" });
            }

            const result = await geocodingService.geocode(data);
            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("não encontrado")) {
                    return res.status(404).json({ message: error.message });
                }
                if (error.message.includes("obrigatório") || error.message.includes("inválido")) {
                    return res.status(400).json({ message: error.message });
                }
            }
            return res.status(500).json({ message: "Erro ao buscar coordenadas do endereço" });
        }
    }

    async reverseGeocode(req: Request, res: Response) {
        try {
            let data: GeocodeReverseDTO;
            
            if (req.query.latitude && req.query.longitude) {
                data = GeocodeReverseDTO.parse({
                    latitude: Number(req.query.latitude),
                    longitude: Number(req.query.longitude),
                });
            } else if (req.body.latitude && req.body.longitude) {
                data = GeocodeReverseDTO.parse({
                    latitude: Number(req.body.latitude),
                    longitude: Number(req.body.longitude),
                });
            } else {
                return res.status(400).json({ message: "Parâmetros 'latitude' e 'longitude' são obrigatórios" });
            }

            const result = await geocodingService.reverseGeocode(data);
            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("não encontrado")) {
                    return res.status(404).json({ message: error.message });
                }
                if (error.message.includes("obrigatório") || error.message.includes("inválido")) {
                    return res.status(400).json({ message: error.message });
                }
            }
            return res.status(500).json({ message: "Erro ao buscar endereço das coordenadas" });
        }
    }
}

export const geocodingController = new GeocodingController();

