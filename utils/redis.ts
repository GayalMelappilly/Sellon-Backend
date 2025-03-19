import { Request } from "express"
import { redis } from "../config/redis"
import { decodeIdFromToken } from "./jwt"

export const getUserCache = async (token: string) => {
    const userId = decodeIdFromToken(token)
    const data = await redis.get(userId) as string
    return JSON.parse(data)
}