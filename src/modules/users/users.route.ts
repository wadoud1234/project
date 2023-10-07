import { FastifyInstance } from "fastify";
import { DeleteUsers, GetAllUsers } from "./users.controller";

export default async function UsersRoutes(app: FastifyInstance) {
    app
        .get("/", GetAllUsers)
        .delete("/", DeleteUsers)
}   