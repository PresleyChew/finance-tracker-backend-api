import { z } from "zod"

export const transactionCreationSchema = z.object({
    desc:z.string().min(1, "Description is required"),
    cost:z.coerce.number().min(0.01, "Cost must be a positive value"),
    category:z.string().min(1, "Category is required"),
    accountId:z.number().int("Account ID must be an integer").min(1,"Account ID is required")
})

