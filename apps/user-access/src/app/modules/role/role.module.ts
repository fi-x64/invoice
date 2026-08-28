import { RoleDestination } from '@common/schemas/role.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleRepository } from './repositories/role.repository';
import { RoleService } from './services/role.service';

@Module({
  imports: [MongooseModule.forFeature([RoleDestination])],
  controllers: [],
  providers: [RoleService, RoleRepository],
  exports: [],
})
export class RoleModule {}
