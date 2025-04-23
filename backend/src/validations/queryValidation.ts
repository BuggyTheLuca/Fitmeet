import { z } from "zod";
import { ActivitySortableFieldEnum, OrderDirectionsEnum } from "../enums/queries.enum";

export const validatePage = z.object({
    page: z.string().transform(Number).refine(val => !isNaN(val), { message: "page must be a number" }).optional(),
    pageSize: z.string().transform(Number).refine(val => !isNaN(val), { message: "pageSize must be a number" }).optional()
})

export const validateActivityOrder = z.object({
    typeId: z.union([
        z.string().uuid(),
        z.string().trim().length(0),
        z.undefined()
    ]),
    orderBy: z.union([
        z.string().refine((val) => 
            Object.values(ActivitySortableFieldEnum).includes(val as ActivitySortableFieldEnum),
            {message: "Informe os campos obrigatórios corretamente."}
        ),
        z.string().trim().length(0),
        z.undefined()
    ]),
    order: z.union([
        z.string().refine((val) =>
            Object.values(OrderDirectionsEnum).includes(val as OrderDirectionsEnum),
            {message: "Informe os campos obrigatórios corretamente."}
        ),
        z.string().trim().length(0),
        z.undefined()
    ])
})