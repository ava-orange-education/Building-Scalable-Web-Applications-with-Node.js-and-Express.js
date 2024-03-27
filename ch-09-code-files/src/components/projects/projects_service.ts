import { Repository } from 'typeorm';
import { BaseService } from '../../utils/base_service';
import { DatabaseUtil } from '../../utils/db';
import { Projects } from './projects_entity';

export class ProjectsService extends BaseService<Projects> {

    constructor() {
        let projectRepository: Repository<Projects> | null = null;
        projectRepository = new DatabaseUtil().getRepository(Projects);
        super(projectRepository);
    }
}
