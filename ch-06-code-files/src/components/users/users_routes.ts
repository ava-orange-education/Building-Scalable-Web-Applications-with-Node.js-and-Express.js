import { Express } from 'express';
import { UserController } from './users_controller';

import { body } from 'express-validator';
import { validate } from '../../utils/validator';
import { authorize } from '../../utils/auth_util';

const validUserInput = [
    body('username').trim().notEmpty().withMessage('It should be required'),
    body('email').isEmail().withMessage('It should be valid emailId'),
    body('password')
        .isLength({ min: 6, max: 12 }).withMessage('It must be between 6 and 12 characters in length')
        .isStrongPassword({ minLowercase: 1, minUppercase: 1, minSymbols: 1, minNumbers: 1 })
        .withMessage('It should include at least one uppercase letter, one lowercase letter, one special symbol, and one numerical digit.'),
    body('role_id').isUUID().withMessage('It must be uuid of role')
];

const updateValidUserInput = [
    body('role_id').isUUID().withMessage('It must be uuid of role')
];

const validChangePassword = [
    body('oldPassword').trim().notEmpty().withMessage('It should be required'),
    body('newPassword')
        .isLength({ min: 6, max: 12 }).withMessage('It must be between 6 and 12 characters in length')
        .isStrongPassword({ minLowercase: 1, minUppercase: 1, minSymbols: 1, minNumbers: 1 })
        .withMessage('It should include at least one uppercase letter, one lowercase letter, one special symbol, and one numerical digit.'), body('role_ids'),
];

const validResetPassword = [
    body('token').trim().notEmpty().withMessage('It should be required'),
    body('newPassword')
        .isLength({ min: 6, max: 12 }).withMessage('It must be between 6 and 12 characters in length')
        .isStrongPassword({ minLowercase: 1, minUppercase: 1, minSymbols: 1, minNumbers: 1 })
        .withMessage('It should include at least one uppercase letter, one lowercase letter, one special symbol, and one numerical digit.'), body('role_ids'),
];


export class UserRoutes {

    private baseEndPoint = '/api/users';

    constructor(app: Express) {

        const controller = new UserController();

        app.route(this.baseEndPoint)
            .all(authorize) // Apply authorization middleware to all routes under this endpoint
            .get(controller.getAllHandler)
            .post(validate(validUserInput), controller.addHandler);

        app.route(this.baseEndPoint + '/:id')
            .all(authorize) // Apply authorization middleware to all routes under this endpoint
            .get(controller.getOneHandler)
            .put(validate(updateValidUserInput), controller.updateHandler)
            .delete(controller.deleteHandler);

        app.route('/api/login')
            .post(controller.login);

        app.route('/api/refresh_token')
            .post(controller.getAccessTokenFromRefreshToken);

        app.route(this.baseEndPoint + '/changePassword/:id')
            .all(authorize)
            .post(validate(validChangePassword), controller.changePassword);

        app.route('/api/forgot_password')
            .post(controller.forgotPassword);

        app.route('/api/reset_password')
            .post(validate(validResetPassword), controller.resetPassword);

    }
}

