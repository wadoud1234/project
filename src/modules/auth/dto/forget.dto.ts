import { z } from "zod"

export const ForgetDto = {
    schema: {
        body: z.object({
            email: z.string().email().min(8)
        })
    }
}
