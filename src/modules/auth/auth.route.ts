import { FastifyInstance } from "fastify";
import { forget, login, register, reset } from "./auth.controller";
import { z } from "zod"
import { ForgetDto, LoginDto, RegisterDto, ResetDto } from "./dto";

export default async function AuthRoutes(app: FastifyInstance) {
    app.post("/register", RegisterDto, register)
    app.post("/login", LoginDto, login)
    app.post("/forget", ForgetDto, forget)
    app.post("/reset", ResetDto, reset)
} 