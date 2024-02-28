import {Body, Controller, Get, Param, Post, Put} from '@nestjs/common';
import {LicenseService} from "./license.service";

@Controller('license')
export class LicenseController {
  constructor(private licenseService: LicenseService) {
  }

  @Get('/result')
  async getResults(){
    return await this.licenseService.getResults()
  }

  @Post('/')
  async new(@Body('key') key: string){
    return await this.licenseService.new(key)
  }

  @Get('/:key')
  async getOne(@Param('key') key: string){
    return this.licenseService.getByKey(key)
  }

  @Put(':key')
  async saveResult(@Param('key') key: string, @Body() data: { data: string, step: number, isEnd: boolean }) {
    return await this.licenseService.saveResult(key, data)
  }

  @Get('/math/:key')
  async getMath(@Param('key') key: string){
    return await this.licenseService.getMath(key)
  }
}
