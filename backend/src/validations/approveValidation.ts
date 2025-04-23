import { z } from "zod";

export const validateApprove = z.object({
    participantId: z.string().uuid(),
    approved: z.boolean(),
})