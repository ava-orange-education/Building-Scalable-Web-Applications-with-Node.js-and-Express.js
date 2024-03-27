import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Users } from '../users/users_entity';
import { Projects } from '../projects/projects_entity';

export enum Status {
    NotStarted = 'Not-Started',
    InProgress = 'In-Progress',
    Completed = 'Completed',
}

export enum Priority {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
}


@Entity()
export class Tasks {
    @PrimaryGeneratedColumn('uuid')
    task_id: string;

    @Column({ length: 30, nullable: false, unique: true })
    name: string;

    @Column({ length: 500 })
    description: string;

    @Column()
    @OneToOne(() => Projects, (projectData) => projectData.project_id)
    @JoinColumn({ name: 'project_id' })
    project_id: Projects;

    @Column()
    @OneToOne(() => Users, (userData) => userData.user_id)
    @JoinColumn({ name: 'user_id' })
    user_id: Users['user_id'];

    @Column()
    estimated_start_time: Date;

    @Column()
    estimated_end_time: Date;

    @Column({ nullable: true })
    actual_start_time: Date;

    @Column({ nullable: true })
    actual_end_time: Date;

    @Column({
        type: 'enum',
        enum: Priority, // Use the enum type here
        default: Priority.Low, // Set a default value as Low
    })
    priority: Priority;

    @Column({
        type: 'enum',
        enum: Status, // Use the enum type here
        default: Status.NotStarted, // Set a default value as Not-Started
    })
    status: Status;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
