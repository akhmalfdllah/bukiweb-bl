import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { User } from "src/modules/user/entities/user.entity";
import { Node } from "src/modules/node/entities/node.entity";
import { TableName } from "src/configs/database.config";

@Entity({ name: TableName.Group })
export class Group {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false, unique: true })
    name: string;

    @Column({ nullable: false })
    description: string;

    @OneToMany(() => User, (user) => user.group)
    members: User;

    @ManyToMany(() => Node, (node) => node.groups)
    @JoinTable()
    apps: Node[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
