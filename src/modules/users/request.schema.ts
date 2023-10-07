export const CreateUsersSchema = {
    schema: {
        body: {
            type: "object",
            properties: {
                name: { type: "string", },
                email: { type: "string" },
                password: { type: "string" }
            },
            required: ["name", "email", "password"]
        }
    }
}
export const DeleteUserSchema = {
    schema: {
        params: {
            type: "object",
            properties: {
                id: { type: "string" }
            },
            required: ["id"]
        }
    }
}