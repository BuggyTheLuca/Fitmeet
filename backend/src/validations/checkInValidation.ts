import { z } from "zod";

export const validateCheckIn = z.object({
    confirmationCode: z.string(),
})