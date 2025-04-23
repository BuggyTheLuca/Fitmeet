import { z } from "zod";
import { isEmptyOrUndefinedString } from "../utils/string-utils";

export const validateNewActivity = z.object({
    title: z.string().trim().nonempty(),
    description: z.string().trim().nonempty(),
    typeId: z.string().uuid(),
    address: z.string().transform((val) => {
        try {
            const parsed = JSON.parse(val);
            if (typeof parsed === "object" && parsed !== null && "latitude" in parsed && "longitude" in parsed) {
                return parsed;
            }
        } catch {
            throw new Error("Invalid address format");
        }
    }),
    scheduledDate: z.string().transform((val) => {
        const testDate = new Date(val)
        if(isNaN(testDate?.getTime())){
            throw new Error("Invalid date format");
        }else{
            return testDate;
        }
    }),
    private: z.string().transform((val) => JSON.parse(val))
})

export const validateUpdateActivity = z.object({
    title: z.string(),
    description: z.string(),
    typeId: z.string().uuid(),
    address: z.string().transform((val) => {
        try {
            if(val && !isEmptyOrUndefinedString(val)){
                const parsed = JSON.parse(val);
                if (typeof parsed === "object" && parsed !== null && "latitude" in parsed && "longitude" in parsed) {
                    return parsed;
                }
            }
        } catch {
            throw new Error("Invalid address format");
        }
    }),
    scheduledDate: z.string().optional().transform((val) => {
        if(val && !isEmptyOrUndefinedString(val)){
            const testDate = new Date(val)
            if(isNaN(testDate?.getTime())){
                throw new Error("Invalid date format");
            }else{
                return testDate;
            }
        }
    }),
    private: z.string().optional().transform((val) => {
        try {
            if(val && !isEmptyOrUndefinedString(val)){
                const parsed = JSON.parse(val);
                if (typeof parsed === "boolean" && parsed !== null) {
                    return parsed;
                }
            }
        } catch {
            throw new Error("Invalid boolean format");
        }
    })
})
