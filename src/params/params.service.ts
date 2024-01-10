import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {ParamsEntity} from "../entity/params.entity";

@Injectable()
export class ParamsService {
  constructor(@InjectRepository(ParamsEntity) private readonly paramsEntity) {
  }

  async getOptions() {
    return this.paramsEntity.findAndCount()
  }
}
