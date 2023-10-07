import { z } from "zod"

export const RegisterDto = {
    schema: {
        body: z.object({
            name: z.string().min(8),
            email: z.string().email().min(8),
            password: z.string().min(8)
        })
    }
}
