import { Buffer } from "buffer";
import { RequestHandler } from "express";

declare function multer(options?: multer.MulterOptions): multer.MulterInstance;

declare namespace multer {
    interface MulterFile {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        buffer: Buffer;
    }

    interface MulterOptions {
        storage?: StorageEngine;
        limits?: {
            fileSize?: number;
        };
    }

    interface StorageEngine {
        _handleFile?(req: Express.Request, file: MulterFile, callback: (error?: Error | null, info?: Partial<MulterFile>) => void): void;
        _removeFile?(req: Express.Request, file: MulterFile, callback: (error: Error | null) => void): void;
    }

    interface MulterInstance {
        single(fieldname: string): RequestHandler;
    }

    function memoryStorage(): StorageEngine;
}

export = multer;

