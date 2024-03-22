
import { Repository } from 'typeorm';
import { BaseService } from '../../utils/base_service';
import { DatabaseUtil } from '../../utils/db';
import { Files } from './files_entity';


export class FilesService extends BaseService<Files> {
    constructor() {
        let filesRepository: Repository<Files> | null = null;
        filesRepository = new DatabaseUtil().getRepository(Files);
        super(filesRepository);

    }
}