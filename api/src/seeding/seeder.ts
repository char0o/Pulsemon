import { NestFactory } from "@nestjs/core";
import { SeederAppModule } from "./seeder.app.module";
import { SeedingService } from "./seeding-service";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederAppModule);

  const seeder = app.get(SeedingService);
  await seeder.seedAll();

  await app.close();
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
