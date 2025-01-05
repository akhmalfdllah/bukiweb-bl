import { 
    Column, 
    Entity, 
    OneToOne, 
    PrimaryGeneratedColumn,
    JoinColumn, 
    OneToMany, 
    CreateDateColumn, 
    UpdateDateColumn} from "typeorm";
import { Exclude } from "class-transformer"
import { TableName, UserRole } from "src/configs/database.config";
import { Group } from "src/modules/group/entities/group.entity";
import { Node } from "src/modules/node/entities/node.entity";
import { Profile } from "src/modules/profile/entities/profile.entity";

@Entity({ name: TableName.User })
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ unique: true })
    username: string

    @Column()
    @Exclude()
    password: string

    @Column({ default: UserRole.Developer })
    role: UserRole;

    @Column({ default: null, nullable: true })
    refreshToken: string | null

    @OneToOne(() => Profile, (profile) => profile.id)
    profile: Profile

    @OneToOne(() => Group, (group) => group.members)
    @JoinColumn()
    group: Group;

    @OneToMany(() => Node, (node) => node.developer)
    nodes: Node[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

};

