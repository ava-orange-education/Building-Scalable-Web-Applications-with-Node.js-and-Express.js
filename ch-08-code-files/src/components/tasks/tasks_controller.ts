import { Response, Request } from 'express';
import { hasPermission } from '../../utils/auth_util';
import { BaseController } from '../../utils/base_controller';
import { TasksService } from './tasks_service';
import { UsersUtil } from '../users/users_controller';
import { ProjectsUtil } from '../projects/projects_controller';
import { NotificationUtil } from '../../utils/notification_util';
import { Tasks } from './tasks_entity';

export class TaskController extends BaseController {

    /**
    * Handles the addition of a new user.
    * @param {object} req - The request object.
    * @param {object} res - The response object.
    */
    public async addHandler(req: Request, res: Response): Promise<void> {

        if (!hasPermission(req.user.rights, 'add_task')) {
            res.status(403).json({ statusCode: 403, status: 'error', message: 'Unauthorised' });
            return;
        }
        try {
            // Create an instance of the ProjectService
            const service = new TasksService();

            // Extract task data from the request body
            const task = req.body;


            // Get the project
            const project = await ProjectsUtil.getProjectByProjectId(task.project_id);

            //check if the provided project_id is valid
            const isValidProject = project ? true : false;

            if (!isValidProject) {
                // If user_ids are invalid, send an error response
                res.status(400).json({ statusCode: 400, status: 'error', message: 'Invalid project_id' });
                return;
            }

            // Check if the provided user_id is valid
            const isValidUser = await UsersUtil.checkValidUserIds([task.user_id]);

            if (!isValidUser) {
                // If user_ids are invalid, send an error response
                res.status(400).json({ statusCode: 400, status: 'error', message: 'Invalid user_id' });
                return;
            }

            // If user_ids are valid, create the task
            const createdTask = await service.create(task);
            res.status(201).json(createdTask);

            // Notify the users of the project that a new task has been created
            await TaskUtil.notifyUsers(project, task, 'add');

        } catch (error) {
            // Handle errors and send an appropriate response
            console.error(`Error while addUser => ${error.message}`);
            res.status(500).json({ statusCode: 500, status: 'error', message: 'Internal server error' });
        }
    }

    public async getAllHandler(req: Request, res: Response): Promise<void> {

        if (!hasPermission(req.user.rights, 'get_all_tasks')) {
            res.status(403).json({ statusCode: 403, status: 'error', message: 'Unauthorised' });
            return;
        }

        const service = new TasksService();
        const result = await service.findAll(req.query);
        const tasks: Tasks[] = result.data;
        res.status(result.statusCode).json(result);

    }

    public async getOneHandler(req: Request, res: Response): Promise<void> {
        if (!hasPermission(req.user.rights, 'get_details_task')) {
            res.status(403).json({ statusCode: 403, status: 'error', message: 'Unauthorised' });
        }
        const service = new TasksService();
        const result = await service.findOne(req.params.id);
        res.status(result.statusCode).json(result);
    }

    public async updateHandler(req: Request, res: Response): Promise<void> {
        if (!hasPermission(req.user.rights, 'edit_task')) {
            res.status(403).json({ statusCode: 403, status: 'error', message: 'Unauthorised' });
            return;
        }
        const task = req.body;
        const service = new TasksService();
        const result = await service.update(req.params.id, task);
        res.status(result.statusCode).json(result);
    }

    public async deleteHandler(req: Request, res: Response): Promise<void> {
        if (!hasPermission(req.user.rights, 'delete_task')) {
            res.status(403).json({ statusCode: 403, status: 'error', message: 'Unauthorised' });
            return;
        }
        const service = new TasksService();
        const result = await service.delete(req.params.id);
        res.status(result.statusCode).json(result);

    }



}

export class TaskUtil {

    // Notify the users of the project that a change
    public static async notifyUsers(project, task, action) {
        if (project) {
            const userIds = project.user_ids;

            let subject = '';
            let body = '';
            if (action === 'add') {
                subject = 'New Task Created';
                body = `A new task has been created with the title ${task.title} and description ${task.description}`;
            } else if (action === 'update') {
                subject = 'Task Updated';
                body = `A task has been updated with the title ${task.title} and description ${task.description}`;
            } else if (action === 'delete') {
                subject = 'Task Deleted';
                body = `A task has been deleted with the title ${task.title} and description ${task.description}`;
            }


            for (const userId of userIds) {
                const user = await UsersUtil.getUserById(userId);
                if (user) {
                    await NotificationUtil.enqueueEmail(
                        user.email,
                        subject,
                        body
                    );
                }
            }
        }
    }

    public static async notifyUsers_(project, task, newTask = true) {
        if (project) {
            const userIds = project.user_ids;
            for (const userId of userIds) {
                const user = await UsersUtil.getUserById(userId);
                if (user) {
                    await NotificationUtil.enqueueEmail(
                        user.email,
                        newTask ? 'New Task Created' : 'Task Updated',
                        newTask ? `A new task has been created with the title ${task.title} and description ${task.description}` : `A task has been updated with the title ${task.title} and description ${task.description}`
                    );
                }
            }
        }
    }


}