import { z } from "zod"

export const ResetDto = {
    schema: {
        querystring: {
            email: z.string().email().min(8),
            token: z.string().min(1)
        },
        body: {
            password: z.string().min(8)
        }
    }
}
