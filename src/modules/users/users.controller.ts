import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUsersBody, DeleteUserBody } from "./body.type";
import prisma from "../../libs/prisma";



export const CreateUser = async (req: FastifyRequest<CreateUsersBody>, res: FastifyReply) => {
    const { name, email, password } = req.body;
    const newUser = await prisma.user.create({ data: { name, email, password } })
    const { password: pass, ...response } = newUser
    res.code(201).send(response)

}

export const GetAllUsers = async (req: FastifyRequest, res: FastifyReply) => {
    console.log({ session: req.session.id })
    const users = await prisma.user.findMany()
    if (!users || users.length <= 0 || !Array.isArray(users)) {
        res
            .code(400)
            .send({ success: true, data: [], errors: "No users found" })
    }
    res.code(200).send({ success: true, data: users })
}

export const DeleteUser = async (req: FastifyRequest<DeleteUserBody>, res: FastifyReply) => {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user || !user.email) {
        return res
            .code(400)
            .send({ success: false, data: [], errors: "No user found to be deleted" })
    }
    const response = await prisma.user.delete({ where: { id } })
    return res.code(203).send({ success: true, data: "User Deleted" })
}

export const DeleteUsers = async (req: FastifyRequest, res: FastifyReply) => {
    await prisma.user.deleteMany()
    return res.code(203).send({ success: true, data: "All users deleted" })
}