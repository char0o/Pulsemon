import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from "typeorm";

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;
}

export abstract class SoftDeleteEntity extends BaseEntity {
  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deletedAt: Date;

  @Column({ nullable: true })
  deletedById: number;

  isDeleted() {
    return this.deletedAt != null;
  }
}
