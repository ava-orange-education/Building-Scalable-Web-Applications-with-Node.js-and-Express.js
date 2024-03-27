import { Express } from 'express';
import { RoleController, RolesUtil } from './roles_controller';
import { validate } from '../../utils/validator';
import { body } from 'express-validator';
import { authorize } from '../../utils/auth_util';

const validRoleInput = [
    body('name').trim().notEmpty().withMessage('It should be required'),
    body('description').isLength({ max: 200 }).withMessage('It has maximum limit of 200 characters'),
    body('rights').custom((value: string) => {
        const accessRights = value?.split(',');
        if (accessRights?.length > 0) {
            const validRights = RolesUtil.getAllPermissionsFromRights();
            const areAllRightsValid = accessRights.every(right => validRights.includes(right));
            if (!areAllRightsValid) {
                throw new Error('Invalid permission');
            }
        }
        return true; // Validation passed
    })
];



export class RoleRoutes {

    private baseEndPoint = '/api/roles';

    constructor(app: Express) {

        const controller = new RoleController();

        app.route(this.baseEndPoint)
            .all(authorize)
            .post(validate(validRoleInput), controller.addHandler)
            .get(controller.getAllHandler);

        app.route(this.baseEndPoint + '/:id')
            .all(authorize)
            .get(controller.getOneHandler)
            .put(validate(validRoleInput), controller.updateHandler)
            .delete(controller.deleteHandler);

        app.route('/api/rights')

            .get(controller.getRightList);
    }
}