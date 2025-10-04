import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import session from "express-session";
import { RedisService } from "./redis/redis.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("Pulsemon API")
    .addCookieAuth("connect.sid")
    .setDescription("API Documentation for Pulsemon")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/", app, document);

  const redisService = app.get(RedisService);

  const redisSecret = process.env.REDIS_SECRET || "mysercret";

  app.use(
    session({
      store: redisService.store,
      secret: redisSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 24 * 30,
      },
    }),
  );

  app.enableCors({
    origin: "http://localhost:3000", // your frontend URL
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true, // if you use cookies or auth headers
  });

  await app.listen(process.env.PORT ?? 3000);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
