import { Request, Response } from "express";
import { ZodError } from "zod";
import { BlobUploadDTO } from "../dtos";
import { blobService } from "../services/blobService";
import { Logger } from "../utils/logger";

export class UploadController {
    async upload(req: Request, res: Response) {
        Logger.controller("Upload", "upload", "req.body(file metadata only)", {
            fileName: req.body?.fileName,
            contentType: req.body?.contentType,
            folder: req.body?.folder,
            access: req.body?.access,
        });

        try {
            const file = req.file;
            if (!file || !file.buffer || !file.originalname) {
                return res.status(400).json({ message: "Arquivo é obrigatório" });
            }

            const payload = BlobUploadDTO.parse(req.body);
            const blob = await blobService.uploadFile({
                fileName: file.originalname,
                contentType: file.mimetype || "application/octet-stream",
                buffer: file.buffer,
                folder: payload.folder,
                access: payload.access,
            });

            Logger.successOperation("UploadController", "upload");
            return res.status(201).json({
                url: blob.url,
                pathname: blob.pathname,
                contentType: blob.contentType,
                downloadUrl: blob.downloadUrl ?? null,
                access: payload.access,
            });
        } catch (error: unknown) {
            Logger.errorOperation("UploadController", "upload", error);

            if (error instanceof ZodError) {
                return res.status(400).json({
                    message: "Payload inválido",
                    details: error.issues,
                });
            }

            return res.status(500).json({ message: "Erro ao enviar arquivo" });
        }
    }
}

export const uploadController = new UploadController();

