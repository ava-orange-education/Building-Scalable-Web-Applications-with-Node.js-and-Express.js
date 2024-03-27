import { Repository } from 'typeorm';
import { ApiResponse, BaseService } from '../../utils/base_service';
import { DatabaseUtil } from '../../utils/db';
import { Tasks } from './tasks_entity';

export class TasksService extends BaseService<Tasks> {
    private taskRepository: Repository<Tasks> | null = null;
    constructor() {
        let taskRepository: Repository<Tasks> | null = null;
        taskRepository = new DatabaseUtil().getRepository(Tasks);
        super(taskRepository);
        this.taskRepository = taskRepository;
    }

    // Override the method from the base service class
    override async findAll(queryParams: object): Promise<ApiResponse<Tasks[]>> {

        const queryBuilder = await this.taskRepository
            .createQueryBuilder('task')
            .leftJoin('task.project_id', 'project')
            .leftJoin('task.user_id', 'user')
            .addSelect([
                'task.*',
                'task.project_id as project',
                'project.project_id',
                'project.name',
                'user.user_id',
                'user.username',
                'user.email',
            ]);

        // Build the WHERE clause conditionally based on the search parameters
        if (queryParams['username']) {
            queryBuilder.andWhere('user.username ILIKE :userName', {
                userName:
                    `%${queryParams['username']}%`
            });
        }

        if (queryParams['projectname']) {
            queryBuilder.andWhere('project.name ILIKE :projectName', {
                projectName:
                    `%${queryParams['projectname']}%`
            });

        }

        if (queryParams['project_id']) {
            queryBuilder.andWhere('task.project_id = :projectId', {
                projectId:
                    queryParams['project_id']
            });
        }

        const data = await queryBuilder.getMany();

        data.forEach((item) => {
            item['projectDetails'] = item.project_id;
            item['userDetails'] = item.user_id;
            delete item.project_id;
            delete item.user_id;
        });
        return { statusCode: 200, status: 'success', data: data };
    }

    override async findOne(id: string): Promise<ApiResponse<Tasks> | undefined> {
        try {
            // Build the WHERE condition based on the primary key
            const where = {};
            const primaryKey: string = this.taskRepository.metadata.primaryColumns[0].databaseName;
            where[primaryKey] = id;

            // Use the repository to find the entity based on the provided ID
            const data = await this.taskRepository
                .createQueryBuilder('task')
                .leftJoin('task.project_id', 'project')
                .leftJoin('task.user_id', 'user')
                .addSelect([
                    'task.*',
                    'task.project_id as project',
                    'project.project_id',
                    'project.name',
                    'user.user_id',
                    'user.username',
                    'user.email',
                ])
                .where(where)
                .getOne();

            if (data) {
                data['projectDetails'] = data.project_id;
                data['userDetails'] = data.user_id;
                delete data.project_id;
                delete data.user_id;
                return { statusCode: 200, status: 'success', data: data };
            } else {
                return { statusCode: 404, status: 'error', message: 'Not Found' };
            }
        } catch (error) {
            return { statusCode: 500, status: 'error', message: error.message };
        }
    }


}
