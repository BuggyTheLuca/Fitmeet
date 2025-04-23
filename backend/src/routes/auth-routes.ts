import { Application, Router } from "express";
import { register, signIn } from "../controllers/auth-controller";
import { validateRegister } from "../validations/userValidations";
import { authValidation } from "../validations/authValidation";
import validateRequest, { ValidatorSchemaTypeEnum } from "../middlewares/request.validator";



const authRoutes = (app: Application) => {
    const router = Router();

    router.post(
        '/register',
        validateRequest(validateRegister, ValidatorSchemaTypeEnum.BODY),
        register
    );
    router.post(
        '/sign-in',
        validateRequest(authValidation, ValidatorSchemaTypeEnum.BODY),
        signIn
    );

    app.use('/auth', router);
}

export default authRoutes;