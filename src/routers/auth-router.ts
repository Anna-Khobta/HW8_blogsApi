import {
    checkCodeInDb,
    checkUserEmailInbase,
    emailValidation, emailValidationSimple,
    loginOrEmailValidation,
    loginValidation,
    passwordValidation
} from "../middlewares/authentication";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {Request, response, Response, Router} from "express";
import {usersRepository} from "../repositories/users-db-repositories";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";
import {authBearerMiddleware} from "../middlewares/authToken";
import {authService} from "../domain/auth-service";

export const authRouter = Router({})

authRouter
    .post("/login",
    loginOrEmailValidation,
    passwordValidation,
    inputValidationMiddleware,
    async (req:Request, res: Response) => {

        let foundUserInDb = await usersRepository.checkUserLoginOrEmail(req.body.loginOrEmail)

        if (foundUserInDb) {
            let login = await usersService.loginUser(foundUserInDb, req.body.loginOrEmail, req.body.password)

            if (login) {
                const jwtResult = await jwtService.createJwtToken(foundUserInDb)

                res
                    .cookie('refreshToken', jwtResult.refreshToken, { httpOnly: true,  secure: 'true' }) // sameSite: "none"})
                    .json({"accessToken": jwtResult.accessToken})
                    .status(200)

            } else {
                res.sendStatus(401)
            }
        } else {
            res.sendStatus(401)
        }

    })

    .get("/me",
    authBearerMiddleware,
    async (req:Request, res: Response) => {

    const meUser = await usersRepository.findUserById(req.user!.id)

        //console.log(meUser)

        res.status(200).send({
            userId: meUser?.id,
            login: meUser?.accountData.login,
            email: meUser?.accountData.email
        })

})


// Registration in the system. Email with confirmation code will be send to passed email address

    .post("/registration",
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidationMiddleware,

    async (req:Request, res: Response) => {

        //let checkUserInDb = await usersRepository.checkUser(req.body.login, req.body.email)

        /*if (!checkUserInDb) {*/
            const newUser = await authService.createUser(req.body.login, req.body.email, req.body.password)
            res.sendStatus(204)
        if (!newUser) {
            res.status(400).json({ message: "Something went wrong with creating"})
        }

    })

    .post("/registration-confirmation",
        checkCodeInDb,
        inputValidationMiddleware,
        async (req:Request, res: Response) => {
        const result = await authService.confirmEmail(req.body.code)
            if (result) {
                res.sendStatus(204)
            } else {
                res.status(400).json({ errorsMessages: [{ message: "Incorrect code or it was already used", field: "code" }] })
            }
        })


    .post("/registration-email-resending",
    emailValidationSimple,
    checkUserEmailInbase,
    inputValidationMiddleware,
    async (req:Request, res: Response) => {

        const result = await authService.checkEmail(req.body.email)
        if (result) {
            res.sendStatus(204)
        } else {
            res.status(400).json({ errorsMessages: [{ message: "Your email was already confirmed", field: "email" }] })
        }
})

    .post("/refresh-token", async (req:Request, res: Response) => {

    const refreshToken = req.cookies['refreshToken']

    if (!refreshToken) {
        return res.status(401).send('Access Denied. No refresh token provided.');

    } else {
        const decodeAndCreateNewTokens = await jwtService.tryDecodeAndCreate(refreshToken)

        if (decodeAndCreateNewTokens) {
            return res.status(200)
                .cookie('refreshToken', decodeAndCreateNewTokens.refreshToken, { httpOnly: true,   secure: 'true' }) // sameSite: "none"})
                .json({"accessToken": decodeAndCreateNewTokens.accessToken})
        } else {
            res.status(401).send('Invalid refresh token')
        }
    }
})

    .post("/logout", async (req:Request, res: Response) => {

        const refreshToken = req.cookies['refreshToken'];

        if (!refreshToken) {
            return res.status(401).send('Access Denied. No refresh token provided.');
        }


            const verifyRefreshToken = await jwtService.verifyToken(refreshToken)
        console.log(verifyRefreshToken)

            if (verifyRefreshToken) {
                return res.sendStatus(204)
            } else {
                return res.status(401).send('Invalid refresh token')
        }
        })

