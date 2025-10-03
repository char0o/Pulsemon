import { Module } from "@nestjs/common";
import { dbModule } from "../db/postgres";
import { SeedingModule } from "./seeding-module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    dbModule,
    SeedingModule,
  ],
})
export class SeederAppModule {}
