/* import {UserDbType} from "./types";
import {authCollection} from "./db";



export const authRepository = {
    async createUserRegistrashion(newUser: UserDbType): Promise<UserDbType | null> {

        const insertNewUserInDb = await authCollection.insertOne(newUser)

        const newUserWithoughtId = await authCollection.findOne(
            {id: newUser.id}, {projection: {_id: 0}})

        return newUserWithoughtId
    }
}*/
