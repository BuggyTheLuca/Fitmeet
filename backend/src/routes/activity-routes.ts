import { Application, Router } from "express";
import { approve, checkIn, conclude, create, deleteActivity, findAll, findAllActivityTypes, findAllByUserAsParticipant, findAllCreatedByUser, findAllPaginated, findByUserAsParticipant, findCreatedByUser, findParticipantsById, subscribe, unsubscribe, update } from "../controllers/activity-controller";
import authGuard from "../middlewares/auth-guard";
import { validateAccountDeleted } from "../middlewares/validate-account-deleted";
import upload from "../configs/multer";
import { validateNewActivity, validateUpdateActivity } from "../validations/activityValidations";
import validateFile from "../middlewares/file.validator";
import { validateActivityOrder, validatePage } from "../validations/queryValidation";
import validateRequest, { ValidatorSchemaTypeEnum } from "../middlewares/request.validator";
import { validateId } from "../validations/paramsValidations";
import { validateApprove } from "../validations/approveValidation";
import { validateCheckIn } from "../validations/checkInValidation";



const activityRoutes = (app: Application) => {
    const router = Router();

    router.use(authGuard, validateAccountDeleted);

    router.get(
        '/types',
        findAllActivityTypes
    );
    router.get(
        '/:id/participants',
        validateRequest(validateId, ValidatorSchemaTypeEnum.PARAMS),
        findParticipantsById
    );
    router.get(
        '/all',
        validateRequest(validateActivityOrder, ValidatorSchemaTypeEnum.QUERY),
        findAll
    );
    router.get(
        '/',
        validateRequest(validateActivityOrder, ValidatorSchemaTypeEnum.QUERY),
        validateRequest(validatePage, ValidatorSchemaTypeEnum.QUERY),
        findAllPaginated
    );
    router.get('/user/creator',
        validateRequest(validatePage, ValidatorSchemaTypeEnum.QUERY),
        findCreatedByUser
    );
    router.get('/user/creator/all',
        findAllCreatedByUser
    );
    router.get('/user/participant',
        validateRequest(validatePage, ValidatorSchemaTypeEnum.QUERY),
        findByUserAsParticipant
    );
    router.get('/user/participant/all',
        findAllByUserAsParticipant
    );
    router.post(
        '/new',
        upload.single("image"),
        validateFile,
        validateRequest(validateNewActivity, ValidatorSchemaTypeEnum.BODY),
        create
    );
    router.post(
        '/:id/subscribe',
        validateRequest(validateId, ValidatorSchemaTypeEnum.PARAMS),
        subscribe
    );
    router.put(
        '/:id/update',
        upload.single("image"), validateFile,
        validateRequest(validateId, ValidatorSchemaTypeEnum.PARAMS),
        validateRequest(validateUpdateActivity, ValidatorSchemaTypeEnum.BODY),
        update
    );
    router.put(
        '/:id/conclude',
        validateRequest(validateId, ValidatorSchemaTypeEnum.PARAMS),
        conclude
    );
    router.put(
        '/:id/approve',
        validateRequest(validateId, ValidatorSchemaTypeEnum.PARAMS),
        validateRequest(validateApprove, ValidatorSchemaTypeEnum.BODY),
        approve
    );
    router.put(
        '/:id/check-in',
        validateRequest(validateId, ValidatorSchemaTypeEnum.PARAMS),
        validateRequest(validateCheckIn, ValidatorSchemaTypeEnum.BODY),
        checkIn
    );
    router.delete(
        '/:id/unsubscribe',
        validateRequest(validateId, ValidatorSchemaTypeEnum.PARAMS),
        unsubscribe
    );
    router.delete(
        '/:id/delete',
        validateRequest(validateId, ValidatorSchemaTypeEnum.PARAMS),
        deleteActivity
    );

    app.use('/activities', router);
}

export default activityRoutes;