import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Profile } from "src/modules/profile/entities/profile.entity";

@Injectable()
export class ProfileRepository extends Repository<Profile> {
  constructor( 
    @InjectRepository(Profile)
    protected repository: Repository<Profile>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
