import { z } from "zod"

export const accountCreationSchema = z.object({
    desc:z.string().min(1,"Description is required"),
    bank:z.string().min(1,"Bank is required"),
    accNo:z.string().min(1,"Bank account number is required")
})