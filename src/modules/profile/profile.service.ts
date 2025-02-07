import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileBodyDto } from './dto/create-profile-body.dto';
import { UpdateProfileBodyDto } from './dto/update-profile-body.dto';
import { ProfileRepository } from './profile.repository';
import { ProfilePayloadDto } from "src/modules/profile/dto/profile-payload.dto"
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProfileService {
  constructor(
    private profileRepository: ProfileRepository
  ) { }

  async create(createProfileBodyDto: CreateProfileBodyDto) {
    console.log(createProfileBodyDto)
    const saved = await this.profileRepository.save(createProfileBodyDto);
    return plainToInstance(ProfilePayloadDto, saved)
  }

  findAll() {
    return this.profileRepository.find();
  }

  findOne(id: string) {
    return this.profileRepository.findOneOrFail({
      where: { id }
    }). catch(() => {
      throw new NotFoundException("profile not found!")
    })
  }

  async update(id: string, updateProfileDto: UpdateProfileBodyDto) {
    //console.log(updateProfileDto)
    const profile = await this.profileRepository.findOneByOrFail({id}).catch (() => {
      throw new NotFoundException("update is failed!");
    });
    const updated = await this.profileRepository.save({...profile, ...updateProfileDto});
    return plainToInstance(ProfilePayloadDto, updated);
  }

  async remove(id: string) {
    const profile = await this.profileRepository.findOneByOrFail({ id }).catch(() => {
      throw new NotFoundException("profile not found!");
    })
    const deleted = await this.profileRepository.remove(profile);
    return deleted;
  }
}