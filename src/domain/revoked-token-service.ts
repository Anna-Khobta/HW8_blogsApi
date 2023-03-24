import {TokenDBType} from "../repositories/types";
import {tokenRepositories} from "../repositories/token-db-repositories";

export const revokedTokenService= {

    async createToken(token: string): Promise<TokenDBType | null> {

        const refreshedToken =
            {
                token: token,
                exp: new Date()
            }

        const addTokenToDb = await tokenRepositories.addToken(refreshedToken)

        return addTokenToDb

    },
}
