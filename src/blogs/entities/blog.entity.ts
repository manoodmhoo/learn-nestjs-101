import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    AfterLoad,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Blog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column({ default: 'nopic.png' })
    image: string;

    @ManyToOne(() => User, (user) => user.blogs)
    user: User;

    @AfterLoad()
    getUri(): void {
        this.image = `${process.env.APP_URL}/images/${this.image}`;
    }
}
