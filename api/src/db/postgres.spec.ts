import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { dbModule } from "./postgres";
import { ConfigModule } from "@nestjs/config";

describe("Database Connection", () => {
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ".env",
          isGlobal: true,
        }),
        dbModule,
      ],
    }).compile();

    dataSource = moduleRef.get<DataSource>(getDataSourceToken());
  });

  afterAll(async () => {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  it("should use the test database", () => {
    expect(dataSource.options.database).toBe(process.env.POSTGRES_DATABASE_TEST);
  });
});
