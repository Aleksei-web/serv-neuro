import {Controller, Get} from '@nestjs/common';
import {ParamsService} from "./params.service";

@Controller('params')
export class ParamsController {

  constructor(private readonly taskService: ParamsService) {
  }

  @Get('/')
  async getAll() {
    return await this.taskService.getOptions()
  }
}
