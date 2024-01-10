import { Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ParamsEntity} from "./entity/params.entity";
import { ParamsModule } from './params/params.module';
import {ParamsController} from "./params/params.controller";
import {ParamsService} from "./params/params.service";
import {LicenseEntity} from "./entity/license.entity";
import { LicenseModule } from './license/license.module';
import {LicenseController} from "./license/license.controller";
import {LicenseService} from "./license/license.service";

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        synchronize: true,
        entities: [ParamsEntity, LicenseEntity],
        logging: true
      }),
      inject: [ConfigService],
    }),
    ParamsModule,
    LicenseModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
