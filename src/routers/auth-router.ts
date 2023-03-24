import {
    checkCodeInDb,
    checkUserEmailInbase,
    emailValidation, emailValidationSimple,
    loginOrEmailValidation,
    loginValidation,
    passwordValidation
} from "../middlewares/authentication";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {Request, Response, Router} from "express";
import {usersRepository} from "../repositories/users-db-repositories";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";
import {authBearerMiddleware} from "../middlewares/authToken";
import {authService} from "../domain/auth-service";

export const authRouter = Router({})

authRouter.post("/login",
    loginOrEmailValidation,
    passwordValidation,
    inputValidationMiddleware,
    async (req:Request, res: Response) => {

        let foundUserInDb = await usersRepository.checkUserLoginOrEmail(req.body.loginOrEmail)

        if (foundUserInDb) {

            let login = await usersService.loginUser(foundUserInDb, req.body.loginOrEmail, req.body.password)

            if (login) {

                const token = await jwtService.createJwtToken(foundUserInDb)

                res.status(200).json({
                    "accessToken": token
                })

            } else {
                res.sendStatus(401)
            }
        } else {
            res.sendStatus(401)
        }

    })

authRouter.get("/me",
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
authRouter
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


