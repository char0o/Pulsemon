import { CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;
}
