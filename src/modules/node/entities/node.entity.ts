import {
    Entity,
    Column,
    CreateDateColumn,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Exclude } from "class-transformer";
import { User } from "src/modules/user/entities/user.entity";
import { Group } from "src/modules/group/entities/group.entity";
import { TableName, NodeStatus, } from "src/configs/database.config";

@Entity({ name: TableName.Node })
export class Node {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    description: string;

    @Column({ nullable: false, default: "/" })
    url: string;

    @Column({ nullable: true, default: null })
    devAppSource: string | null;

    @Column({ nullable: true, default: null })
    devCssSource: string | null;

    @Column({ nullable: true, default: null })
    appSource: string | null;

    @Column({ nullable: true, default: null })
    cssSource: string | null;

    @Column({ nullable: false, default: NodeStatus.Ongoing })
    status: NodeStatus;

    @Column({ nullable: false, default: false })
    isActive: boolean;

    @Column({ nullable: false, default: false })
    isPublished: boolean;

    @Column({ nullable: true, default: null })
    @Exclude()
    publishToken: string | null;

    @ManyToOne(() => User, (user) => user.nodes, { nullable: false })
    developer: User;

    @ManyToOne(() => Node, (node) => node.items, { nullable: true })
    parent: Node | null;

    @OneToMany(() => Node, (node) => node.parent)
    items: Node[];

    @ManyToMany(() => Group, (node) => node.apps)
    groups: Group[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
