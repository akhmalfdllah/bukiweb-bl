import { ApiBearerAuth } from "@nestjs/swagger";
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EnsureValid, TokenGuard, } from "src/shared/decorators/common.decorator"
import { ProfileService } from './profile.service';
import { createProdfileBodySchema, CreateProfileBodyDto } from './dto/create-profile-body.dto';
import { UpdateProfileBodyDto } from './dto/update-profile-body.dto';

@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @Post()
  @TokenGuard()
  @EnsureValid(createProdfileBodySchema, "body")
  create(@Body() createProfileBodyDto: CreateProfileBodyDto) {
    // console.log()
    // return ""
    return this.profileService.create(createProfileBodyDto);
  }

  @Get()
  findAll() {
    return this.profileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfileBodyDto: UpdateProfileBodyDto) {
    return this.profileService.update(id, updateProfileBodyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(id);
  }
}
