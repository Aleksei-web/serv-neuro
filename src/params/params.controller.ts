import {Body, Controller, Get, Param, Post, Put} from '@nestjs/common';
import {ParamsService} from "./params.service";

export interface ITestParams {
  alias: string
  params: string
}

export interface IParams {
  id: number
  alias: string
  params: string
}

@Controller('params')
export class ParamsController {

  constructor(private readonly taskService: ParamsService) {
  }

  @Get('/:alias')
  async getByAlias(@Param('alias') alias: string) {
    return await this.taskService.getOneByAlias(alias)
  }

  @Put('')
  async update(@Body() testParams: IParams) {
    return await this.taskService.update(testParams)
  }


  @Post('/')
  async create(@Body() testParams: ITestParams){
    return await this.taskService.create(testParams)
  }
}
