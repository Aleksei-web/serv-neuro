import { Module } from '@nestjs/common';
import { LicenseService } from './license.service';
import { LicenseController } from './license.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ParamsEntity} from "../entity/params.entity";
import {LicenseEntity} from "../entity/license.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([LicenseEntity])
  ],
  providers: [LicenseService],
  controllers: [LicenseController]
})
export class LicenseModule {}
