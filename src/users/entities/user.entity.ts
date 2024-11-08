import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Blog } from '../../blogs/entities/blog.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'member' })
  role: string;

  @Column({ default: true })
  is_active: boolean;

  // relation with blog
  @OneToMany(() => Blog, blog => blog.user)
  blogs: Blog[];
}


