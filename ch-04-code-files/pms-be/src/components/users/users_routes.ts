import { Express } from 'express';
import { UserController } from './users_controller';


export class UserRoutes {

    private baseEndPoint = '/api/users';

    constructor(app: Express) {

        const controller = new UserController();

        app.route(this.baseEndPoint)
            .get(controller.getAllHandler)
            .post(controller.addHandler);

        app.route(this.baseEndPoint + '/:id')
            .get(controller.getDetailsHandler)
            .put(controller.updateHandler)
            .delete(controller.deleteHandler);

    }
}
