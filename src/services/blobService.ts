import { PutBlobResult, put } from "@vercel/blob";
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

    async uploadFile({ fileName, contentType, buffer, folder, access = "public" }: UploadFileParams): Promise<PutBlobResult> {
        const token = this.getToken();

        if (!buffer.byteLength) {
            throw new Error("Arquivo vazio ou inválido.");
        }

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

