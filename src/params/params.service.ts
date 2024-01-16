import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {ParamsEntity} from "../entity/params.entity";
import {IParams, ITestParams} from "./params.controller";

@Injectable()
export class ParamsService {
  constructor(@InjectRepository(ParamsEntity) private readonly paramsEntity) {
  }

  async getOptions() {
    return this.paramsEntity.findAndCount()
  }

  async create(testParams: ITestParams) {
    try {
      const params = await this.paramsEntity.create(testParams)
      return await this.paramsEntity.insert(params)
    } catch (e) {
      return new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async getOneByAlias(alias: string) {
    try {
      const param = await this.paramsEntity.findOne({
        where: [
          {alias}
        ]
      })

      if (!param) {
        return new NotFoundException()
      }
      param.params = JSON.parse(param.params)

      return param
    } catch (e) {
      return new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async update(testParams: IParams) {
    try {
      const t = await this.paramsEntity.findOneById(testParams.id)
      console.log({t})
      if (!t) return new NotFoundException()

      t.params = testParams.params
      await this.paramsEntity.save(t)
      t.params = JSON.parse(testParams.params)

      return t
    } catch (e) {
      return new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }
}
