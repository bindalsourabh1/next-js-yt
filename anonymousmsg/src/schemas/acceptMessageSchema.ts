import {z} from "zod";

export const acceptMessageSchema = z.object({
    acceptingMessges: z.boolean()
}) 