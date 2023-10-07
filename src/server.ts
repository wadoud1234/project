import { FastifyInstance } from "fastify";
import { HOST, PORT } from "./constants";
import app from "./app";

async function main(server: FastifyInstance, port: number, host: string): Promise<void> {
    try {
        await server.listen({ port, host })
    } catch (error) {
        server.log.error(error)
        process.exit(1);
    }
}
main(app, PORT, HOST);