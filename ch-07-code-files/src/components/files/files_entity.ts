import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Users } from '../users/users_entity';
import { Tasks } from '../tasks/tasks_entity';

@Entity()
export class Files {
    @PrimaryGeneratedColumn('uuid')
    file_id: string;

    @Column({ length: 30, nullable: false, unique: true })
    file_name: string;

    @Column({ length: 30 })
    mime_type: string;

    @Column()
    @ManyToOne(() => Users, (userData) => userData.user_id)
    @JoinColumn({ name: 'user_id' })
    created_by: string;

    @Column()
    @ManyToOne(() => Tasks, (taskData) => taskData.task_id)
    @JoinColumn({ name: 'task_id' })
    task_id: string;

    @Column()
    @CreateDateColumn()
    created_at: Date;

    @Column()
    @UpdateDateColumn()
    updated_at: Date;
}