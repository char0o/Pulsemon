import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { AxiosResponse } from "axios";
import { firstValueFrom } from "rxjs";
import { ApiJob } from "src/api-job/api-job.entity";
import { ApiMetric } from "src/api-metric/api-metric.entity";
import { CreateApiMetricCommand } from "src/api-metric/commands/create-api-metric.command";
import { Api } from "src/api/api.entity";
import { HttpMethods } from "src/endpoint/http-methods.constants";
import { Repository } from "typeorm";

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(ApiJob)
    private readonly apiJobRepository: Repository<ApiJob>,
    @InjectRepository(Api)
    private readonly apiRepository: Repository<Api>,
    private readonly commandBus: CommandBus,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async checkJobs() {
    const jobs = await this.apiJobRepository.find();

    const now = new Date();

    for (const job of jobs) {
      const nextRun = job.lastRun
        ? new Date(job.lastRun.getTime() + job.intervalSeconds * 1000)
        : new Date(0);

      if (now >= nextRun) {
        const apiToCall = await this.apiRepository.findOne({
          where: { id: job.apiId },
          relations: ["endpoints"],
        });

        if (!apiToCall) {
          this.logger.error("Api not found for job", job.id);
          continue;
        }

        for (const endpoint of apiToCall.endpoints) {
          const { path, method } = endpoint;

          try {
            const url = apiToCall.url + path;
            let response: AxiosResponse;
            const start = Date.now();
            switch (method) {
              case HttpMethods.GET:
                response = await firstValueFrom(
                  this.httpService.get(url, { validateStatus: () => true }),
                );
                break;
              case HttpMethods.POST:
                response = await firstValueFrom(
                  this.httpService.post(url, { validateStatus: () => true }),
                );
                break;
              case HttpMethods.PUT:
                response = await firstValueFrom(
                  this.httpService.put(url, { validateStatus: () => true }),
                );
                break;
              case HttpMethods.DELETE:
                response = await firstValueFrom(
                  this.httpService.delete(url, { validateStatus: () => true }),
                );
                break;
              case HttpMethods.PATCH:
                response = await firstValueFrom(
                  this.httpService.patch(url, { validateStatus: () => true }),
                );
                break;
            }
            const end = Date.now();
            const durationMs = end - start;

            let errorMessage: string | undefined = undefined;

            if (response.status >= 400) {
              errorMessage = response.statusText;
            }

            const params = {
              api: apiToCall,
              responseTime: durationMs,
              statusCode: response.status,
              errorMessage,
            };

            await this.commandBus.execute(new CreateApiMetricCommand(params));
          } catch (error) {
            let errorMessage = "Unknown error";

            if (error instanceof Error) {
              errorMessage = error.message;
            }
            const params = {
              api: apiToCall,
              responseTime: 0,
              statusCode: 599,
              errorMessage: errorMessage,
            };

            await this.commandBus.execute(new CreateApiMetricCommand(params));
          }
          job.lastRun = new Date();
          await this.apiJobRepository.save(job);
        }
      }
    }
  }

  async onModuleInit() {
    this.logger.log("Init module");
    await this.checkJobs();
  }
}
