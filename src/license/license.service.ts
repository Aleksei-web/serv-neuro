import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {LicenseEntity} from "../entity/license.entity";
import {json} from "express";

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

  async saveResult(key: string, data: { data: string, step: number, isEnd: boolean }) {
    try {
      const license = await this.license.findOne({
        where: [
          {key}
        ]
      })
      if (license.isActive === "0") {
        return new HttpException('Не найдена активная лицензия', HttpStatus.NOT_FOUND)
      }

      if (license.data) {
        license.data = JSON.stringify([...JSON.parse(license.data), ...JSON.parse(data.data)])
      } else {
        license.data = data.data
      }

      license.step = data.step

      if (data.isEnd) {
        license.isActive = 0
      }


      console.log(license)
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
    try {
      const res = await this.license.find({
        where: [
          {isActive: 0}
        ]
      })

      return res.map(el => ({...el, data: JSON.parse(el.data.replaceAll('\\', ''))}))
    } catch (e) {
      return new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  calcDataset(resData: any) {
    const TEST_TYPE = {
      INVESTIGATION: "Расследование",
      IDENTITY: "Идентификация",
      SOLUTIONS: "Принятие решений",
      NUMBERS: "Обработка информации",
      CONSISTENT_NUMBERS: "Последовательный",
      GRADE2: "Оценка 2",
      SYNCHRONIZE: "Синхронизация",
      PROGRAMMING: "Программирование",
      RECOGNIZE: "Распознавание",
      EQUIVALENCE: "Эквивалентность",
      COORDINATION: "Координация",
      CONSISTENT_BALLS: "Концентрация",
      DECODING: "Декодирование",
      GRADE: "Оценка",
      MULTIPLE_TASK: "Многозадачность",
      GRADE3: "Оценка-3",
      SPEED: "Скорость",
    }

    const mathResList = {
      INVESTIGATION: resData.filter(el => el.type === TEST_TYPE.INVESTIGATION).map(e => Number(e.total.split('=')[1]))[0],
      IDENTITY: resData.filter(el => el.type === TEST_TYPE.IDENTITY).map(e => Number(e.total.split('=')[1]))[0],
      SOLUTIONS: resData.filter(el => el.type === TEST_TYPE.SOLUTIONS).map(e => Number(e.total.split('=')[1]))[0],
      NUMBERS: resData.filter(el => el.type === TEST_TYPE.NUMBERS).map(e => Number(e.total.split('=')[1]))[0],
      CONSISTENT_NUMBERS: resData.filter(el => el.type === TEST_TYPE.CONSISTENT_NUMBERS).map(e => Number(e.total.split('=')[1]))[0],
      GRADE2: resData.filter(el => el.type === TEST_TYPE.GRADE2).map(e => Number(e.total.split('=')[1]))[0],
      SYNCHRONIZE: resData.filter(el => el.type === TEST_TYPE.SYNCHRONIZE).map(e => Number(e.total.split('=')[1]))[0],
      PROGRAMMING: resData.filter(el => el.type === TEST_TYPE.PROGRAMMING).map(e => Number(e.total.split('=')[1]))[0],
      RECOGNIZE: resData.filter(el => el.type === TEST_TYPE.RECOGNIZE).map(e => Number(e.total.split('=')[1]))[0],
      EQUIVALENCE: resData.filter(el => el.type === TEST_TYPE.EQUIVALENCE).map(e => Number(e.total.split('=')[1]))[0],
      COORDINATION: resData.filter(el => el.type === TEST_TYPE.COORDINATION).map(e => Number(e.total.split('=')[1]))[0],
      CONSISTENT_BALLS: resData.filter(el => el.type === TEST_TYPE.CONSISTENT_BALLS).map(e => Number(e.total.split('=')[1]))[0],
      DECODING: resData.filter(el => el.type === TEST_TYPE.DECODING).map(e => Number(e.total.split('=')[1]))[0],
      GRADE: resData.filter(el => el.type === TEST_TYPE.GRADE).map(e => Number(e.total.split('=')[1]))[0],
      MULTIPLE_TASK: resData.filter(el => el.type === TEST_TYPE.MULTIPLE_TASK).map(e => Number(e.total.split('=')[1]))[0],
      GRADE3: resData.filter(el => el.type === TEST_TYPE.GRADE3).map(e => Number(e.total.split('=')[1]))[0],
    }

    // внимание
    const attention = {
      inhibition: (mathResList.SOLUTIONS +
        mathResList.NUMBERS +
        mathResList.SYNCHRONIZE +
        mathResList.PROGRAMMING +
        mathResList.RECOGNIZE +
        mathResList.EQUIVALENCE +
        mathResList.COORDINATION +
        mathResList.GRADE +
        mathResList.MULTIPLE_TASK) / 9,
      dividedAttention: (mathResList.CONSISTENT_NUMBERS +
        mathResList.PROGRAMMING +
        mathResList.RECOGNIZE +
        mathResList.CONSISTENT_BALLS +
        mathResList.IDENTITY +
        mathResList.INVESTIGATION +
        mathResList.GRADE +
        mathResList.MULTIPLE_TASK) / 8,
      focusedAttention: (mathResList.SOLUTIONS +
        mathResList.NUMBERS +
        mathResList.CONSISTENT_NUMBERS +
        mathResList.SYNCHRONIZE +
        mathResList.EQUIVALENCE +
        mathResList.COORDINATION +
        mathResList.CONSISTENT_BALLS +
        mathResList.INVESTIGATION +
        mathResList.MULTIPLE_TASK) / 9
    }

    // восприятие
    const perception = {
      auditoryPerception: (mathResList.GRADE2 + mathResList.IDENTITY + mathResList.INVESTIGATION) / 3,
      visualPerception: (mathResList.SOLUTIONS + mathResList.NUMBERS + mathResList.CONSISTENT_NUMBERS + mathResList.SYNCHRONIZE + mathResList.RECOGNIZE +
        mathResList.EQUIVALENCE + mathResList.DECODING + mathResList.IDENTITY + mathResList.INVESTIGATION + mathResList.GRADE + mathResList.MULTIPLE_TASK +
        mathResList.GRADE3) / 12
    }

    //  координация
    const coordination = {
      spatialPerception: (mathResList.PROGRAMMING + mathResList.COORDINATION + mathResList.CONSISTENT_BALLS + mathResList.GRADE + mathResList.MULTIPLE_TASK +
        mathResList.GRADE3) / 6,
      handEyeCoordination: (mathResList.SOLUTIONS + mathResList.GRADE2 + mathResList.SYNCHRONIZE + mathResList.COORDINATION + mathResList.GRADE + mathResList.MULTIPLE_TASK) / 6
    }

    // рассуждение
    const reasoning = {
      abilityToEvaluate: (mathResList.SOLUTIONS + mathResList.NUMBERS + mathResList.PROGRAMMING + mathResList.RECOGNIZE + mathResList.EQUIVALENCE + mathResList.DECODING +
        mathResList.IDENTITY + mathResList.INVESTIGATION + mathResList.GRADE + mathResList.MULTIPLE_TASK + mathResList.GRADE3) / 11,
      cognitiveFlexibility: (mathResList.NUMBERS + mathResList.SYNCHRONIZE + mathResList.EQUIVALENCE + mathResList.COORDINATION + mathResList.DECODING + mathResList.IDENTITY +
        mathResList.INVESTIGATION + mathResList.MULTIPLE_TASK) / 8,
      reactionTime: (mathResList.SOLUTIONS + mathResList.NUMBERS + mathResList.GRADE2 + mathResList.RECOGNIZE + mathResList.EQUIVALENCE + mathResList.CONSISTENT_BALLS +
        mathResList.DECODING + mathResList.IDENTITY + mathResList.INVESTIGATION + mathResList.GRADE + mathResList.MULTIPLE_TASK) / 11
    }

    // память
    const memory = {
      shortTermMemory: (mathResList.CONSISTENT_NUMBERS + mathResList.GRADE2 + mathResList.RECOGNIZE + mathResList.CONSISTENT_BALLS + mathResList.IDENTITY +
        mathResList.INVESTIGATION) / 6,
      nonverbalMemory: (mathResList.GRADE2 + mathResList.RECOGNIZE + mathResList.CONSISTENT_BALLS + mathResList.IDENTITY + mathResList.INVESTIGATION) / 5,
      verbalMemory: (mathResList.CONSISTENT_NUMBERS + mathResList.IDENTITY + mathResList.INVESTIGATION) / 3
    }

    const total = Object.values(mathResList).reduce((p, c) => p + c) / Object.values(mathResList).length

    return [
      Object.values(attention).reduce((p, c) => p + c) / 3,
      Object.values(perception).reduce((p, c) => p + c) / 2,
      Object.values(coordination).reduce((p, c) => p + c) / 2,
      Object.values(reasoning).reduce((p, c) => p + c) / 3,
      Object.values(memory).reduce((p, c) => p + c) / 3,
      total
    ]
  }

  async getMath() {
    const res = await this.license.findOne({
      where: [
        {key: "gk-5006"},
      ]
    })

    const resData = JSON.parse(res.data)
    const avgDataset = await this.calcAvgDataset()

    await this.calcAvgDataset()

    return {
      dataset: [{
        label: "Сред.",
        data: avgDataset,
        backgroundColor: "#26c6da",
      },
        {
          label: "Респондент",
          data: this.calcDataset(resData),
          backgroundColor: "orange",
        }
      ]
    }
  }

  async calcAvgDataset() {
    const res = await this.license.find({
      where: [
        {step: 17},
      ]
    })

    const resArr = []

    const all = res.map(el => this.calcDataset(JSON.parse(el.data)));
    all.forEach(arr => {
      arr.forEach((val, idx) => {
        if (!resArr[idx]) {
          resArr[idx] = val
        } else {
          resArr[idx] = resArr[idx] + val
        }
      })
    })

    return resArr.map(el => el / all.length)
  }
}
