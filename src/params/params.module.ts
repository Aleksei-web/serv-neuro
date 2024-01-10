import { Module } from '@nestjs/common';
import { ParamsService } from './params.service';
import { ParamsController } from './params.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ParamsEntity} from "../entity/params.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([ParamsEntity])
  ],
  providers: [ParamsService],
  controllers: [ParamsController]
})
export class ParamsModule {}
