import {TokenDBType} from "./types";
import {revokedTokensCollection} from "./db";


export const tokenRepositories = {

    async addToken(refreshedToken: TokenDBType): Promise<TokenDBType | null> {

        const insertNewTokenToBl = await revokedTokensCollection.insertOne(refreshedToken)

        return refreshedToken
    },

    async findToken(refreshToken: string): Promise<TokenDBType | null> {

        const foundTokenInDb = await revokedTokensCollection.findOne({token: refreshToken})

        if (!foundTokenInDb) {
            return null
        } else {
            return foundTokenInDb
        }
    }
}