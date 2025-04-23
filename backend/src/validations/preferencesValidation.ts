import { z } from "zod";

export const preferencesValidation = z.array(z.string().uuid());