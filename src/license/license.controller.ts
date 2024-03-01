import {Body, Controller, Get, Param, Post, Put, UploadedFile, UseInterceptors} from '@nestjs/common';
import {LicenseService} from "./license.service";
import {FileInterceptor} from '@nestjs/platform-express';
import * as fs from 'node:fs'
import * as nodemailer from 'nodemailer'
import * as process from "process";


@Controller('license')
export class LicenseController {
  constructor(private licenseService: LicenseService) {
  }

  @Get('/result')
  async getResults() {
    return await this.licenseService.getResults()
  }

  @Post('/')
  async new(@Body('key') key: string) {
    return await this.licenseService.new(key)
  }

  @Get('/:key')
  async getOne(@Param('key') key: string) {
    return this.licenseService.getByKey(key)
  }

  @Put(':key')
  async saveResult(@Param('key') key: string, @Body() data: { data: string, step: number, isEnd: boolean }) {
    return await this.licenseService.saveResult(key, data)
  }

  @Get('/math/:key')
  async getMath(@Param('key') key: string) {
    return await this.licenseService.getMath(key)
  }

  @Put('/user/:key')
  async putUser(
    @Param('key') key: string,
    @Body('email') email: string,
    @Body('userName') userName: string,
    @Body('dateStart') dateStart: string,
    @Body('birthDate') birthDate: string,
  ) {
    return await this.licenseService.putUser(key, email, userName, dateStart, birthDate)
  }

  @Post('upload/:key')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('email') email: string, @Param('key') key: string,) {

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: '"Алексей Максимушкин" <maksimushkiun@mail.ru>', // sender address
      to: "maksimushkin92@gmail.com", // list of receivers
      subject: "Результаты теста.", // Subject line
      html: "<p>Вы прошли тест на определение когнитивных навыков.</p>", // html body
      attachments: [
        {filename: 'результаты-теста.pdf', content: file.buffer}
      ]
    });

    if(info) {
      return this.licenseService.changeSendEmail(key)
    }
  }
}
