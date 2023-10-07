import Fastify from "fastify";
import UsersRoutes from "./modules/users/users.route";
import ProductsRoutes from "./modules/products/products.route";
import AuthRoutes from "./modules/auth/auth.route";
import redis from "@fastify/redis"
import cookie from "@fastify/cookie"
import secureSession from "@fastify/secure-session"
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { HOUR } from "./constants";

declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: "production" | "developement",
        EMAIL_SERVICE_API_KEY: string,
        DATABASE_URL: string,
        DEV_URL: string,
        SESSION_SECRET: string,
        SESSION_SALT: string,
        COOKIE_KEY: string
    }
}


const app = Fastify({
    logger: {
        transport: {
            target: "pino-pretty",
            options: { translateTime: 'HH:MM:ss Z' },
        }
    },
    ignoreTrailingSlash: true
}).withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(redis, {
    host: "localhost",
    port: 6379
})

app.register(cookie)
app.register(secureSession, {
    sessionName: "session",
    cookieName: "cookie",
    secret: String(process.env.SESSION_SECRET),
    salt: String(process.env.SESSION_SALT),
    key: Buffer.from(String(process.env.COOKIE_KEY), "hex"),
    cookie: {
        maxAge: HOUR,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: process.env.NODE_ENV === "production"
    }
})


// Redis Cache :


// Routes :
app.get("/", (_, reply) => {
    app.log.warn(app.redis.session);
    ; reply.code(200).send({ message: "Hello world", session: app.redis.session })
})
app.register(AuthRoutes, { prefix: "/auth" })
app.register(UsersRoutes, { prefix: "/users" })
app.register(ProductsRoutes, { prefix: "/products" })

export default app;