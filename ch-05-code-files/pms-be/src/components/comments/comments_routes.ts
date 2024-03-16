import { Express } from 'express';
import { CommentController } from './comments_controller';


export class CommentRoutes {

    private baseEndPoint = '/api/comments';

    constructor(app: Express) {

        const controller = new CommentController();

        app.route(this.baseEndPoint)
            .get(controller.getAllHandler)
            .post(controller.addHandler);

        app.route(this.baseEndPoint + '/:id')
            .get(controller.getDetailsHandler)
            .put(controller.updateHandler)
            .delete(controller.deleteHandler);
    }
}
