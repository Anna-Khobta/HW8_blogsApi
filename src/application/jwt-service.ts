import jwt from 'jsonwebtoken'
import {UserDbType} from "../repositories/types";
import {settings} from "../settings";
import {revokedTokenService} from "../domain/revoked-token-service";
import {tokenRepositories} from "../repositories/token-db-repositories";



export const jwtService = {
    async createJwtToken(foundUserInDb: UserDbType) {

        const accessToken = jwt.sign({userId: foundUserInDb.id}, settings.JWT_SECRET, {expiresIn: '10s'})
        const refreshToken = jwt.sign({userId: foundUserInDb.id}, settings.JWT_SECRET, {expiresIn: '20s'})

        const jwtResult = {accessToken: accessToken, refreshToken: refreshToken}
        return jwtResult
    },

    async getUserIdByToken(tokenFromHead: string) {

        try {
            const result: any = jwt.verify(tokenFromHead, settings.JWT_SECRET) // если verify не сработает, упадет ошибка

            return result.userId

        } catch (error) {
            return null
        }
    },

    async tryDecodeAndCreate(refreshToken: string) {

        const decodedRefreshToken: any = jwt.verify(refreshToken, settings.JWT_SECRET)

        if (!decodedRefreshToken) {
            return null
        } else {

            const checkRefreshTokenInDb = await tokenRepositories.findToken(refreshToken)
            if (checkRefreshTokenInDb) {
                return null
            } else {

                const newAccessToken = jwt.sign({userId: decodedRefreshToken.userId}, settings.JWT_SECRET, {expiresIn: '10s'})
                const newRefreshToken = jwt.sign({userId: decodedRefreshToken.id}, settings.JWT_SECRET, {expiresIn: '20s'})

                const addOldTokenInDb =  await revokedTokenService.createToken(refreshToken)
                // так можно ??

                const jwtResult = {accessToken: newAccessToken, refreshToken: newRefreshToken}
                return jwtResult
            }
        }
    },

    async verifyToken(refreshToken: string) {

        const decodedRefreshToken: any = jwt.verify(refreshToken, settings.JWT_SECRET)

        if (!decodedRefreshToken) {
            return null
        }
            const checkRefreshTokenInDb = await tokenRepositories.findToken(refreshToken)
            if (checkRefreshTokenInDb) {
                return null
            }

                const addOldTokenInDb = await revokedTokenService.createToken(refreshToken)
                // так можно ??

                return addOldTokenInDb
            }
}