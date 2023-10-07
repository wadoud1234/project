import { z } from "zod"

export const LoginDto = {
    schema: {
        body: z.object({
            email: z.string().email().min(8),
            password: z.string().min(8)
        })
    }
}
