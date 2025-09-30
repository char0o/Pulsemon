import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { EndpointModule } from "./endpoint/endpoint.module";
import { dbModule } from "./db/postgres";
import { cqrsModule } from "./cqrs";
import { ApiModule } from "./api/api.module";

@Module({
  imports: [dbModule, EndpointModule, cqrsModule, ApiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
