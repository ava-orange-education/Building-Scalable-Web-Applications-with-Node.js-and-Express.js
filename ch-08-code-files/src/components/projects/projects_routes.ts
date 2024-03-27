import { Express } from 'express';
import { ProjectController } from './projects_controller';
import { body } from 'express-validator';
import { validate } from '../../utils/validator';
import { authorize } from '../../utils/auth_util';
import { checkValidDate } from '../../utils/common';

const validProjectInput = [
    body('name').trim().notEmpty().withMessage('It should be required'),
    body('user_ids').isArray().withMessage('It should be ids of users array'),
    body('start_time').custom((value) => {
        if (!checkValidDate(value)) {
            throw new Error('Invalid date format YYYY-MM-DD HH:mm:ss');
        }
        const startTime = new Date(value);
        const currentTime = new Date();

        if (startTime <= currentTime) {
            throw new Error('Start time must be greater than the current time');
        }
        return true;
    }),
    body('end_time').custom((value, { req }) => {
        if (!checkValidDate(value)) {
            throw new Error('Invalid date format YYYY-MM-DD HH:mm:ss');
        }
        const startTime = new Date(req.body.start_time);
        const endTime = new Date(value);

        if (endTime <= startTime) {
            throw new Error('End time must be greater than the start time');
        }
        return true;
    })
];

export class ProjectRoutes {

    private baseEndPoint = '/api/projects';

    constructor(app: Express) {

        const controller = new ProjectController();

        app.route(this.baseEndPoint)
            .all(authorize)
            .get(controller.getAllHandler)
            .post(validate(validProjectInput), controller.addHandler);

        app.route(this.baseEndPoint + '/:id')
            .all(authorize)
            .get(controller.getOneHandler)
            .put(controller.updateHandler)
            .delete(controller.deleteHandler);
    }
}
