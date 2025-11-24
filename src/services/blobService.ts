import { PutBlobResult, put } from "@vercel/blob";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { Logger } from "../utils/logger";

type UploadFileParams = {
    fileName: string;
    contentType: string;
    buffer: Buffer;
    folder?: string;
    access?: "public";
};

class BlobService {
    private getToken() {
        const token = process.env.BLOB_READ_WRITE_TOKEN ?? process.env.VERCEL_BLOB_READ_WRITE_TOKEN;
        if (!token) {
            throw new Error("Token do Vercel Blob não configurado. Defina BLOB_READ_WRITE_TOKEN ou VERCEL_BLOB_READ_WRITE_TOKEN.");
        }
        return token;
    }

    private getUploadsDirectory(): string {
        const uploadsDir = path.join(process.cwd(), "uploads");
        if (!existsSync(uploadsDir)) {
            mkdirSync(uploadsDir, { recursive: true });
        }
        return uploadsDir;
    }

    private async saveFileLocally({ fileName, contentType, buffer, folder }: UploadFileParams): Promise<PutBlobResult> {
        const sanitizedFolder = folder?.trim().replace(/^[\\/]+|[\\/]+$/g, "");
        const baseDir = this.getUploadsDirectory();
        
        const targetDir = sanitizedFolder 
            ? path.join(baseDir, sanitizedFolder)
            : baseDir;
        
        if (!existsSync(targetDir)) {
            mkdirSync(targetDir, { recursive: true });
        }

        const fileExtension = path.extname(fileName);
        const baseName = path.basename(fileName, fileExtension);
        const uniqueId = randomUUID();
        const uniqueFileName = `${baseName}-${uniqueId}${fileExtension}`;
        const filePath = path.join(targetDir, uniqueFileName);

        writeFileSync(filePath, buffer);

        const relativePath = sanitizedFolder 
            ? `uploads/${sanitizedFolder}/${uniqueFileName}`
            : `uploads/${uniqueFileName}`;
        
        const port = process.env.PORT || 8080;
        const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
        const url = `${baseUrl}/${relativePath}`;
        const pathname = `/${relativePath}`;
        return {
            url,
            pathname,
            contentType,
            contentDisposition: `inline; filename="${fileName}"`,
            contentLength: buffer.byteLength,
            uploadId: uniqueId,
            etag: uniqueId,
            downloadUrl: url,
        } as PutBlobResult;
    }

    async uploadFile({ fileName, contentType, buffer, folder, access = "public" }: UploadFileParams): Promise<PutBlobResult> {
        if (!buffer.byteLength) {
            throw new Error("Arquivo vazio ou inválido.");
        }

        if (process.env.UPLOAD_TYPE === "local") {
            return this.saveFileLocally({ fileName, contentType, buffer, folder });
        }

        const token = this.getToken();
        const sanitizedFolder = folder?.trim().replace(/^[\\/]+|[\\/]+$/g, "");
        const key = sanitizedFolder ? `${sanitizedFolder}/${fileName}` : fileName;

        try {
            const blob = await put(key, buffer, {
                access,
                contentType,
                token,
                addRandomSuffix: true,
            });

            return blob;
        } catch (error) {
            Logger.errorOperation("BlobService", "uploadFile", error);
            throw new Error("Falha ao enviar arquivo para o Vercel Blob.");
        }
    }
}

export const blobService = new BlobService();

