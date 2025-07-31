import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity("admins")
export class Admin {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'username' })
    username!: string;

    @Column({ name: 'password' })
    password!: string;
}