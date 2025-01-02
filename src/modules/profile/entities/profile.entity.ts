import {
    Column,
    //CreateDateColumn,
    Entity,
    //JoinTable,
   // ManyToMany,
    //OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    //UpdateDateColumn,
} from "typeorm";
import { TableName } from "src/configs/database.config";
import { User } from "src/modules/user/entities/user.entity";

@Entity({ name: TableName.Profile })
export class Profile {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column()
    email: string;


    @OneToOne(() => User, (user) => user.profile)
    user: User
}
