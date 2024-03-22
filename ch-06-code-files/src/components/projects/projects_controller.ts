import { Response, Request } from 'express';
import { hasPermission } from '../../utils/auth_util';
import { ProjectsService } from './projects_service';
import { UsersUtil } from '../users/users_controller';
import { BaseController } from '../../utils/base_controller';

export class ProjectController extends BaseController {
    /**
        * Handles the addition of a new user.
        * @param {object} req - The request object.
        * @param {object} res - The response object.
        */
    public async addHandler(req: Request, res: Response): Promise<void> {

        if (!hasPermission(req.user.rights, 'add_project')) {
            res.status(403).json({ statusCode: 403, status: 'error', message: 'Unauthorised' });
            return;
        }
        try {
            // Create an instance of the ProjectService
            const service = new ProjectsService();

            // Extract project data from the request body
            const project = req.body;

            // Check if the provided user_ids are valid
            const isValidUsers = await UsersUtil.checkValidUserIds(project.user_ids);

            if (!isValidUsers) {
                // If user_ids are invalid, send an error response
                res.status(400).json({ statusCode: 400, status: 'error', message: 'Invalid user_ids' });
                return;
            }

            // If user_ids are valid, create the user
            const createdProject = await service.create(project);
            res.status(createdProject.statusCode).json(createdProject);


        } catch (error) {
            // Handle errors and send an appropriate response
            console.error(`Error while addUser => ${error.message}`);
            res.status(500).json({ statusCode: 500, status: 'error', message: 'Internal server error' });
        }
    }

    public async getAllHandler(req: Request, res: Response): Promise<void> {

        if (!hasPermission(req.user.rights, 'get_all_projects')) {
            res.status(403).json({ statusCode: 403, status: 'error', message: 'Unauthorised' });
            return;
        }

        const service = new ProjectsService();
        const result = await service.findAll(req.query);
        for (const project of result.data) {
            project['users'] = await UsersUtil.getUsernamesById(project.user_ids);
            delete project.user_ids;
        }

        res.status(result.statusCode).json(result);
    }

    public async getOneHandler(req: Request, res: Response): Promise<void> {
        if (!hasPermission(req.user.rights, 'get_details_project')) {
            res.status(403).json({ statusCode: 403, status: 'error', message: 'Unauthorised' });
        }
        const service = new ProjectsService();
        const result = await service.findOne(req.params.id);
        result.data['users'] = await UsersUtil.getUsernamesById(result.data.user_ids);
        delete result.data.user_ids;
        res.status(result.statusCode).json(result);
    }

    public async updateHandler(req: Request, res: Response): Promise<void> {
        if (!hasPermission(req.user.rights, 'edit_project')) {
            res.status(403).json({ statusCode: 403, status: 'error', message: 'Unauthorised' });
            return;
        }
        const project = req.body;
        const service = new ProjectsService();
        const result = await service.update(req.params.id, project);
        res.status(result.statusCode).json(result);
    }

    public async deleteHandler(req: Request, res: Response): Promise<void> {
        if (!hasPermission(req.user.rights, 'delete_project')) {
            res.status(403).json({ statusCode: 403, status: 'error', message: 'Unauthorised' });
            return;
        }
        const service = new ProjectsService();
        const result = await service.delete(req.params.id);
        res.status(result.statusCode).json(result);

    }

}

export class ProjectsUtil {
    public static async checkValidProjectIds(project_ids: string[]) {
        const projectService = new ProjectsService();

        // Query the database to check if all project_ids are valid
        const projects = await projectService.findByIds(project_ids);

        // Check if all project_ids are found in the database
        return projects.data.length === project_ids.length;
    }
} 
