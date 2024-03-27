import { Express } from 'express';
import { TaskController } from './tasks_controller';
import { body } from 'express-validator';
import { checkValidDate } from '../../utils/common';
import { validate } from '../../utils/validator';
import { authorize } from '../../utils/auth_util';

const validTaskInput = [
    body('name').trim().notEmpty().withMessage('It should be required'),
    body('project_id').trim().notEmpty().withMessage('It should be required'),
    body('user_id').trim().notEmpty().withMessage('It should be required'),
    body('estimated_start_time').trim().notEmpty().withMessage('It should be required'),
    body('estimated_end_time').trim().notEmpty().withMessage('It should be required'),
    body('estimated_start_time').custom((value) => {
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
    body('estimated_end_time').custom((value, { req }) => {
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

const updateTaskInput = [
    body('estimated_start_time').custom((value) => {
        if (value && !checkValidDate(value)) {
            throw new Error('Invalid date format YYYY-MM-DD HH:mm:ss');
        }
        const startTime = new Date(value);
        const currentTime = new Date();

        if (startTime <= currentTime) {
            throw new Error('Start time must be greater than the current time');
        }
        return true;
    }),
    body('estimated_end_time').custom((value, { req }) => {
        if (value && !checkValidDate(value)) {
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




export class TaskRoutes {

    private baseEndPoint = '/api/tasks';

    constructor(app: Express) {

        const controller = new TaskController();

        app.route(this.baseEndPoint)
            .all(authorize)
            .get(controller.getAllHandler)
            .post(validate(validTaskInput), controller.addHandler);


        app.route(this.baseEndPoint + '/:id')
            .all(authorize)
            .get(controller.getOneHandler)
            .put(validate(updateTaskInput), controller.updateHandler)
            .delete(controller.deleteHandler);
    }
}
