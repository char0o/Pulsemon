import { IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Endpoint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  path: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  method: string;

  @Column()
  @IsString()
  description: string;
}
