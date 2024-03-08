import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {LicenseEntity} from "../entity/license.entity";

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

@Injectable()
export class LicenseService {

  constructor(@InjectRepository(LicenseEntity) private readonly license) {
  }

  async new(key: string) {
    try {
const arr = Array(2000).fill(1).map((_, i) => i+21)
      for(let a of arr){
        console.log({a})
        let key = ''
        if(a < 100){
          key = `m-00${a.toString()}`
        }if(a < 1000){
          key = `m-0${a.toString()}`
        } if(a >= 1000){
          key = `m-${a.toString()}`
        }
        console.log('ee', key)
        // const item = await this.license.create({key: key, type: 'mini'})
        // await this.license.insert(item)
      }

    } catch (e) {
      return new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async saveResult(key: string, data: { data: string, step: number, isEnd: boolean }) {
    try {
      const license = await this.license.findOne({
        where: [
          {key}
        ]
      })
      console.log('Обновляю лицензию', key, data.data)
      if (license.isActive === "0") {
        return new HttpException('Не найдена активная лицензия', HttpStatus.NOT_FOUND)
      }

      if (license.data) {
        const keyNew = JSON.parse(data.data).type
        let existsKey = license.data ? JSON.parse(license.data || '[]').find(el => el.type === keyNew) : false
        if (existsKey) {
          return new HttpException('Тест уже пройден.', HttpStatus.BAD_REQUEST)
        }
        license.data = JSON.stringify([...JSON.parse(license.data || '[]'), ...JSON.parse(data.data)])
      } else {
        license.data = data.data
      }

      license.step = data.step

      if (data.isEnd) {
        license.isActive = 0
      }

      await this.license.save(license)

      return license
    } catch (e) {
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

    // console.log('shortTermMemory', resData.filter(el => el.type === TEST_TYPE.CONSISTENT_NUMBERS))
    // память
    const memory = {
      shortTermMemory: (mathResList.CONSISTENT_NUMBERS + mathResList.GRADE2 + mathResList.RECOGNIZE + mathResList.CONSISTENT_BALLS + mathResList.IDENTITY +
        mathResList.INVESTIGATION) / 6,
      nonverbalMemory: (mathResList.GRADE2 + mathResList.RECOGNIZE + mathResList.CONSISTENT_BALLS + mathResList.IDENTITY + mathResList.INVESTIGATION) / 5,
      verbalMemory: (mathResList.CONSISTENT_NUMBERS + mathResList.IDENTITY + mathResList.INVESTIGATION) / 3
    }

    const total = Object.values(mathResList).reduce((p, c) => p + c) / Object.values(mathResList).length
    const attentionTotal = Object.values(attention).reduce((p, c) => p + c) / 3
    const perceptionTotal = Object.values(perception).reduce((p, c) => p + c) / 2
    const coordinationTotal = Object.values(coordination).reduce((p, c) => p + c) / 2
    const reasoningTotal = Object.values(reasoning).reduce((p, c) => p + c) / 3
    const memoryTotal = Object.values(memory).reduce((p, c) => p + c) / 3

    return {
      total: [
        attentionTotal,
        Object.values(perception).reduce((p, c) => p + c) / 2,
        Object.values(coordination).reduce((p, c) => p + c) / 2,
        Object.values(reasoning).reduce((p, c) => p + c) / 3,
        Object.values(memory).reduce((p, c) => p + c) / 3,
        total
      ],
      attention: [
        attention.inhibition,
        attention.dividedAttention,
        attention.focusedAttention,
        attentionTotal
      ],
      perception: [
        perception.auditoryPerception,
        perception.visualPerception,
        perceptionTotal
      ],
      coordination: [
        coordination.spatialPerception,
        coordination.handEyeCoordination,
        coordinationTotal
      ],
      reasoning: [
        reasoning.abilityToEvaluate,
        reasoning.cognitiveFlexibility,
        reasoning.reactionTime,
        reasoningTotal
      ],
      memory: [
        memory.shortTermMemory,
        memory.nonverbalMemory,
        memory.verbalMemory,
        memoryTotal
      ]
    }
  }

  async calcDefaultMath(res: any) {
    const resData = JSON.parse(res.data)
    const avg = await this.calcAvgDataset()
    const avgDatasetTotal = avg.total
    const avgAttention = avg.attention
    const avgPerception = avg.perception
    const avgCoordination = avg.coordination
    const avgReasoning = avg.reasoning
    const avgMemory = avg.memory

    return {
      datasetTotal: [{
        label: "Сред.",
        data: avgDatasetTotal,
        backgroundColor: "#26c6da",
      },
        {
          label: "Респондент",
          data: this.calcDataset(resData).total,
          backgroundColor: "orange",
        }
      ],
      datasetAttention: [
        {
          label: "Сред.",
          data: avgAttention,
          backgroundColor: "#26c6da",
        },
        {
          label: "Респондент",
          data: this.calcDataset(resData).attention,
          backgroundColor: "orange",
        }
      ],
      datasetPerception: [
        {
          label: "Сред.",
          data: avgPerception,
          backgroundColor: "#26c6da",
        },
        {
          label: "Респондент",
          data: this.calcDataset(resData).perception,
          backgroundColor: "orange",
        }
      ],
      datasetCoordination: [
        {
          label: "Сред.",
          data: avgCoordination,
          backgroundColor: "#26c6da",
        },
        {
          label: "Респондент",
          data: this.calcDataset(resData).coordination,
          backgroundColor: "orange",
        }
      ],
      datasetReasoning: [
        {
          label: "Сред.",
          data: avgReasoning,
          backgroundColor: "#26c6da",
        },
        {
          label: "Респондент",
          data: this.calcDataset(resData).reasoning,
          backgroundColor: "orange",
        }
      ],
      datasetMemory: [
        {
          label: "Сред.",
          data: avgMemory,
          backgroundColor: "#26c6da",
        },
        {
          label: "Респондент",
          data: this.calcDataset(resData).memory,
          backgroundColor: "orange",
        }
      ],
    }
  }

  async getMath(key: string) {
    const res = await this.license.findOne({
      where: [
        {key: key},
      ]
    })

    if ((res.type === 'default' && res.step !== 17) || res.type === 'mini' && res.step !== 4) {
      throw new NotFoundException()
    }

    if (res.type === 'default') {
      return await this.calcDefaultMath(res)
    }
    if (res.type === 'mini') {
      return await this.calcMiniMath(res)
    }
  }

  async calcAvgDataset() {
    const res = await this.license.find({
      where: [
        {step: 17},
      ]
    })

    const resArrTotal = []

    const all = res.map(el => this.calcDataset(JSON.parse(el.data)).total);
    all.forEach(arr => {
      arr.forEach((val, idx) => {
        if (!resArrTotal[idx]) {
          resArrTotal[idx] = val
        } else {
          resArrTotal[idx] = resArrTotal[idx] + val
        }
      })
    })

    const attention: number[][] = res.map(el => this.calcDataset(JSON.parse(el.data)).attention);
    let attentionRes = attention.reduce((prev, curr) => prev.map((v, i) => v + curr[i]))
    const perception = res.map(el => this.calcDataset(JSON.parse(el.data)).perception);
    let perceptionRes = perception.reduce((prev, curr) => prev.map((v, i) => v + curr[i]))
    const coordination = res.map(el => this.calcDataset(JSON.parse(el.data)).coordination);
    let coordinationRes = coordination.reduce((prev, curr) => prev.map((v, i) => v + curr[i]))
    const reasoning = res.map(el => this.calcDataset(JSON.parse(el.data)).reasoning);
    const reasoningRes = reasoning.reduce((prev, curr) => prev.map((v, i) => v + curr[i]))
    const memory = res.map(el => this.calcDataset(JSON.parse(el.data)).memory);
    const memoryRes = memory.reduce((prev, curr) => prev.map((v, i) => v + curr[i]))


    return {
      total: resArrTotal.map(el => el / all.length),
      attention: attentionRes.map(el => el / attention.length),
      perception: perceptionRes.map(el => el / perception.length),
      coordination: coordinationRes.map(el => el / coordination.length),
      reasoning: reasoningRes.map(el => el / reasoning.length),
      memory: memoryRes.map(el => el / memory.length)
    }
  }

  async putUser(key: string, email: string, userName: string, dateStart: string, birthDate: string) {
    const license = await this.license.findOne({
      where: [
        {key},
      ]
    })

    if (!license) {
      throw new NotFoundException()
    }

    license.userName = userName;
    license.email = email;
    license.dateStart = dateStart
    license.birthDate = birthDate

    return await this.license.save(license)
  }

  async changeSendEmail(key: string) {
    const license = await this.license.findOne({
      where: [
        {key},
      ]
    })

    license.isSendEmail = 1;
    return await this.license.save(license)
  }

  private async calcMiniMath(res: any) {
    const avgDatasetTotal = await this.calcAvgDatasetMini()
    const resData = JSON.parse(res.data)
    return {
      datasetTotal: [{
        label: "Сред.",
        data: Object.values(avgDatasetTotal),
        backgroundColor: "#26c6da",
      },
        {
          label: "Респондент",
          data: Object.values(this.calcDatasetMini(resData, true)),
          backgroundColor: "orange",
        }
      ],
    }
  }

  private calcDatasetMini(resData: any, isUser = false) {
    const mathResList = {
      PROGRAMMING: resData.filter(el => el.type === TEST_TYPE.PROGRAMMING).map(e => Number(e.total.split('=')[1]))[0],
      COORDINATION: resData.filter(el => el.type === TEST_TYPE.COORDINATION).map(e => Number(e.total.split('=')[1]))[0],
      CONSISTENT_BALLS: resData.filter(el => el.type === TEST_TYPE.CONSISTENT_BALLS).map(e => Number(e.total.split('=')[1]))[0],
      MULTIPLE_TASK: resData.filter(el => el.type === TEST_TYPE.MULTIPLE_TASK).map(e => Number(e.total.split('=')[1]))[0],
    }

    // внимание
    const attention = {
      inhibition: (
        mathResList.PROGRAMMING +
        mathResList.COORDINATION +
        mathResList.MULTIPLE_TASK) / 3,
      dividedAttention: (
        mathResList.PROGRAMMING +
        mathResList.CONSISTENT_BALLS +
        mathResList.MULTIPLE_TASK) / 3,
      focusedAttention: (
        mathResList.COORDINATION +
        mathResList.CONSISTENT_BALLS +
        mathResList.MULTIPLE_TASK) / 3
    }

    //  координация
    const coordination = {
      spatialPerception: (mathResList.PROGRAMMING + mathResList.COORDINATION + mathResList.CONSISTENT_BALLS + mathResList.MULTIPLE_TASK) / 4
    }

    // рассуждение
    const reasoning = {
      abilityToEvaluate: (mathResList.PROGRAMMING + mathResList.MULTIPLE_TASK) / 2,
      cognitiveFlexibility: (mathResList.COORDINATION + mathResList.MULTIPLE_TASK) / 2,
      reactionTime: (mathResList.CONSISTENT_BALLS + mathResList.MULTIPLE_TASK) / 2
    }

    const attentionTotal = Object.values(attention).reduce((p, c) => p + c) / 3
    const coordinationTotal = coordination.spatialPerception
    const reasoningTotal = Object.values(reasoning).reduce((p, c) => p + c) / 3

    return {
      attention: attentionTotal,
      coordination: coordinationTotal,
      reasoning: reasoningTotal,
      inhibition: attention.inhibition,
      dividedAttention: attention.dividedAttention,
      focusedAttention: attention.focusedAttention,
      spatialPerception: coordination.spatialPerception,
      abilityToEvaluate: reasoning.abilityToEvaluate,
      cognitiveFlexibility: reasoning.cognitiveFlexibility,
      reactionTime: reasoning.reactionTime
    }
  }

  private async calcAvgDatasetMini() {
    const res = await this.license.query(`select *
                                          from license
                                          where (step = 17 and type = 'default')
                                             or (step = 4 and type = 'mini')`);

    const attention: number[] = res.map(el => this.calcDatasetMini(JSON.parse(el.data)).attention);

    let attentionRes = attention.reduce((prev, curr) => prev + curr) / attention.length
    const coordination = res.map(el => this.calcDatasetMini(JSON.parse(el.data)).coordination);
    let coordinationRes = coordination.reduce((prev, curr) => prev + curr) / coordination.length
    const reasoning = res.map(el => this.calcDatasetMini(JSON.parse(el.data)).reasoning);
    const reasoningRes = reasoning.reduce((prev, curr) => prev + curr) / reasoning.length
    const inhibition = res.map(el => this.calcDatasetMini(JSON.parse(el.data)).inhibition);
    const inhibitionRes = inhibition.reduce((prev, curr) => prev + curr) / inhibition.length
    const dividedAttention = res.map(el => this.calcDatasetMini(JSON.parse(el.data)).dividedAttention);
    const dividedAttentionRes = dividedAttention.reduce((prev, curr) => prev + curr) / dividedAttention.length
    const focusedAttention = res.map(el => this.calcDatasetMini(JSON.parse(el.data)).focusedAttention);
    const focusedAttentionRes = focusedAttention.reduce((prev, curr) => prev + curr) / focusedAttention.length
    const spatialPerception = res.map(el => this.calcDatasetMini(JSON.parse(el.data)).spatialPerception);
    const spatialPerceptionRes = spatialPerception.reduce((prev, curr) => prev + curr) / spatialPerception.length
    const abilityToEvaluate = res.map(el => this.calcDatasetMini(JSON.parse(el.data)).abilityToEvaluate);
    const abilityToEvaluateRes = abilityToEvaluate.reduce((prev, curr) => prev + curr) / abilityToEvaluate.length
    const cognitiveFlexibility = res.map(el => this.calcDatasetMini(JSON.parse(el.data)).cognitiveFlexibility);
    const cognitiveFlexibilityRes = cognitiveFlexibility.reduce((prev, curr) => prev + curr) / cognitiveFlexibility.length
    const reactionTime = res.map(el => this.calcDatasetMini(JSON.parse(el.data)).cognitiveFlexibility);
    const reactionTimeRes = reactionTime.reduce((prev, curr) => prev + curr) / reactionTime.length


    return {
      attention: attentionRes,
      coordination: coordinationRes,
      reasoning: reasoningRes,
      inhibition: inhibitionRes,
      dividedAttention: dividedAttentionRes,
      focusedAttention: focusedAttentionRes,
      spatialPerceptionRes: spatialPerceptionRes,
      abilityToEvaluate: abilityToEvaluateRes,
      cognitiveFlexibility: cognitiveFlexibilityRes,
      reactionTime: reactionTimeRes
    }
  }
}
