import { Express, Router } from 'express';
import { RoleRoutes } from '../components/roles/roles_routes';
import { UserRoutes } from '../components/users/users_routes';
import { ProjectRoutes } from '../components/projects/projects_routes';
import { TaskRoutes } from '../components/tasks/tasks_routes';
import { CommentRoutes } from '../components/comments/comments_routes';
import { FileRoutes } from '../components/files/files_route';

export class Routes {
    public router: Router;

    constructor(app: Express) {

        const routeClasses = [
            RoleRoutes,
            UserRoutes,
            ProjectRoutes,
            TaskRoutes,
            CommentRoutes,
            FileRoutes
        ];

        for (const routeClass of routeClasses) {
            try {
                new routeClass(app);
                console.log(`Router : ${routeClass.name} - Connected`);
            } catch (error) {
                console.log(`Router : ${routeClass.name} - Failed`);
            }
        }
    }
}
