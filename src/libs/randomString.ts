import { randomBytes } from "crypto";

const generateRandomString = async (size: number = 64) => {
    const value = randomBytes(size).toString("hex")
    return value
}

export default generateRandomString;