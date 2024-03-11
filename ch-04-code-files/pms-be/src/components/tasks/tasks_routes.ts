import { Express } from 'express';
import { TaskController } from './tasks_controller';


export class TaskRoutes {

    private baseEndPoint = '/api/tasks';

    constructor(app: Express) {

        const controller = new TaskController();

        app.route(this.baseEndPoint)
            .get(controller.getAllHandler)
            .post(controller.addHandler);

        app.route(this.baseEndPoint + '/:id')
            .get(controller.getDetailsHandler)
            .put(controller.updateHandler)
            .delete(controller.deleteHandler);
    }
}
