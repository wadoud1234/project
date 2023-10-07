import { FastifyReply, FastifyRequest } from "fastify";
import { ForgetPassword, Login, Register, Reset } from "./interfaces";
import prisma from "../../libs/prisma";
import { CreateUser } from "../users/users.controller";
import { httpCodes } from "../../constants/httpCodes";
import { compare, hashString } from "../../libs/hashing";
import generateRandomString from "../../libs/randomString";
import { MINUTE, SENDER_EMAIL } from "../../constants";
import { sendPasswordResetEmail } from "../../libs/email";

export const register = async (req: FastifyRequest<Register>, res: FastifyReply) => {
    const { name, email, password } = req.body
    const oldUser = await prisma.user.findUnique({ where: { email } })
    if (oldUser && oldUser.id) {
        return res
            .code(httpCodes.BAD_REQUEST)
            .send({ success: false, errors: "Email already used" })
    }

    const hash = await hashString(password)

    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hash
        }
    })


    // TODO implement email verification 
    // Generate session 
    // save it in redis 
    return res
        .code(httpCodes.CREATED)
        .send({ success: true, data: newUser })
}

export const login = async (req: FastifyRequest<Login>, res: FastifyReply) => {
    console.log({ session: req.session, cookies: req.cookies });
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || !user.id) {
        return res
            .code(httpCodes.BAD_REQUEST)
            .send({ success: false, errors: "Wrong credentials" })
    }

    const isPasswordsEqual = await compare(user.password, password)
    if (!isPasswordsEqual) {
        return res
            .code(httpCodes.UNAUTHORIZED)
            .send({ success: false, errors: "Wrong Credentials" })
    }
    req.session.set("userId", user.id)


    // TODO generate session 
    // save session in redis
    // save cookies
    return res.code(httpCodes.OK).send({
        success: true,
        data: user
    })
}

export const forget = async (req: FastifyRequest<ForgetPassword>, res: FastifyReply) => {
    const { email } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.id) {
        return res
            .code(httpCodes.OK)
            .send({ success: true, errors: "Email was sent to address" })
    }

    // generate the forgetToken and its expiry time
    const forgetPasswordToken = await generateRandomString(64)
    const hashedForgetToken = await hashString(forgetPasswordToken)
    const hashedForgetTokenExpiry = new Date(Date.now() + 15 * MINUTE)
    const resetLink = `${process.env.DEV_URL}/auth/reset?email=${email},token=${forgetPasswordToken}`

    await sendPasswordResetEmail({
        from: SENDER_EMAIL,
        to: email,
        link: resetLink
    })

    await prisma.token.create({
        data: {
            userId: user.id,
            token: hashedForgetToken,
            tokenExpiry: hashedForgetTokenExpiry
        }
    })

    // TODO generate Email with a token 
    // send an email to the user address with a resetToken
    return res
        .code(httpCodes.OK)
        .send({ success: true, data: `Email was sent to your email : (${email})` })
}

export const reset = async (req: FastifyRequest<Reset>, res: FastifyReply) => {
    const { token, email } = req.query;
    const { password } = req.body

    const oldUser = await prisma.user.findUnique({ where: { email } })

    if (!oldUser || !oldUser.id || !token) {
        return res
            .code(httpCodes.BAD_REQUEST)
            .send({ success: false, errors: "Wrong Credentials" })
    }
    const newUser = await prisma.user.update({ where: { email }, data: { password } })

    // TODO generate session
    // update session 
    // update cookies

    return res
        .code(httpCodes.OK)
        .send({ success: true, data: newUser })
}

