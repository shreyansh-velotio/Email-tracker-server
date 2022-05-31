import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    type: Number,
    description: 'User id',
    example: '7',
  })
  id: number;

  @Column({ unique: true })
  @ApiProperty({
    type: String,
    description: 'Username',
    example: 'shrey_shreyansh',
  })
  username: string;

  @Column()
  @ApiProperty({
    type: String,
    description: 'Password',
    example: 'pass_shrey',
  })
  password: string;

  @Column()
  @ApiProperty({
    type: String,
    description: 'Name',
    example: 'Shreyansh Shrey',
  })
  name: string;

  @Column()
  @ApiProperty({
    type: String,
    description: 'Role',
    example: 'admin',
  })
  role: string;
}
