import { Application, Router } from "express";
import { getLoggedUser, getPreferences, update, updateAvatar, updatePreferences, deactivate } from "../controllers/user-controller";
import upload from "../configs/multer";
import authGuard from "../middlewares/auth-guard";
import { validateAccountDeleted } from "../middlewares/validate-account-deleted";
import { preferencesValidation } from "../validations/preferencesValidation";
import validateFile  from "../middlewares/file.validator";
import validateRequest, { ValidatorSchemaTypeEnum } from "../middlewares/request.validator";


const userRoutes = (app: Application) => {
    const router = Router();
    
    router.use(authGuard, validateAccountDeleted);

    router.get(
        '',
        getLoggedUser
    );
    router.get(
        '/preferences',
        getPreferences
    );
    router.post(
        '/preferences/define',
        validateRequest(preferencesValidation, ValidatorSchemaTypeEnum.BODY),
        updatePreferences
    );
    router.put(
        '/avatar',
        upload.single("avatar"),
        validateFile,
        updateAvatar
    );
    router.put(
        '/update',
        update
    );
    router.delete(
        '/deactivate',
        deactivate
    )

    app.use('/user', router)
}

export default userRoutes;