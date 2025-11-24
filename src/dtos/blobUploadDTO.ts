import { z } from "zod";

export const BlobUploadDTO = z.object({
    folder: z.string().optional(),
    access: z.literal("public").default("public"),
});

export type BlobUploadDTO = z.infer<typeof BlobUploadDTO>;

