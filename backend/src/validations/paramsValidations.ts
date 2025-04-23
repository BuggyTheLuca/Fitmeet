import { z } from "zod";

export const validateId = z.object({
    id: z.string().uuid()
});