import { Express } from 'express';
import { FileController } from './files_controller';
import { fileUploadMiddleware } from '../../utils/multer';
import { authorize } from '../../utils/auth_util';
export class FileRoutes {

    private baseEndPoint = '/api/files';

    constructor(app: Express) {

        const controller = new FileController();
        app.route(this.baseEndPoint)
            .all(authorize)
            .post(fileUploadMiddleware, controller.addHandler);

        app.route(this.baseEndPoint + '/:id')
            .all(authorize)
            .get(controller.getOneHandler);
    }

}
