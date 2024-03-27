import { BaseController } from '../../utils/base_controller';
import { uploadFile } from '../../utils/multer';
import { Request, Response } from 'express';
import { FilesService } from './files_service';
import { Files } from './files_entity';
import * as config from '../../../server_config.json';
import { IServerConfig } from '../../utils/config';
export class FileController extends BaseController {

    /**
    * Handles the addition of a new user.
    * @param {object} req - The request object.
    * @param {object} res - The response object.
    */
    public async addHandler(req: Request, res: Response): Promise<void> {

        try {

            const fileDataFromMulter = uploadFile(req);

            // Create an instance of the ProjectService
            const service = new FilesService();
            const fileData = new Files();
            fileData.file_name = fileDataFromMulter.filename;
            fileData.mime_type = fileDataFromMulter.mimetype;
            fileData.created_by = req?.user?.user_id ? req?.user?.user_id : null;
            fileData.task_id = req.body.task_id;
            const createdFile = await service.create(fileData);

            res.status(200).json({ message: 'File uploaded successfully', createdFile });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async getAllHandler(req: Request, res: Response): Promise<void> {
    }

    public async getOneHandler(req: Request, res: Response): Promise<void> {

        try {
            const service = new FilesService();
            const server_config: IServerConfig = config;

            const result = await service.findOne(req.params.id);
            const file_path = `${server_config.attached_files_path}/${result.data.file_name}`;
            res.sendFile(file_path, (err) => {
                if (err) {
                    // Handle errors, such as file not found or permission issues
                    console.error('Error sending file:', err);
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).end();
                }
            });

        } catch (error) {
            res.status(400).json({ error: error.message });
        }

    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async updateHandler(req: Request, res: Response): Promise<void> { }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async deleteHandler(req: Request, res: Response): Promise<void> { }
}