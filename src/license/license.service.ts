import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {LicenseEntity} from "../entity/license.entity";

@Injectable()
export class LicenseService {

  constructor(@InjectRepository(LicenseEntity) private readonly license) {
  }

  async new(key: string) {
    try {
      const item = await this.license.create({key})
      await this.license.insert(item)
      return item
    } catch (e) {
      return new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async isActive(key: string): Promise<boolean> {
    const license = await this.license.findOne({
      where: [
        {key},
        {isActive: true}
      ]
    })
    return !!license
  }

  async saveResult(key: string, data: {data:string}) {
    try {
      const license = await this.license.findOne({
        where: [
          {key}
        ]
      })
      if (license.isActive  === "0") {
        return new HttpException('Не найдена активная лицензия', HttpStatus.NOT_FOUND)
      }
      license.data = data.data
      license.isActive = 0
      await this.license.save(license)

      return license
    } catch (e) {
      console.log(e)
      return new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async getByKey(key: string) {
    return await this.license.findOne({
      where: [
        {key},
      ]
    })
  }

  async getResults() {
    try{
      const res = await this.license.find({
        where: [
          {isActive: 0}
        ]
      })

      return res.map(el => ({...el, data: JSON.parse(el.data.replaceAll('\\', ''))}))
    }catch (e){
      return new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }
}
