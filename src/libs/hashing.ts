import { hash, verify } from "argon2"

export const hashString = async (str: string) => {
    return await hash(str)
}

export const compare = async (old: string, str: string) => {
    return await verify(old, str)
}
