import { User } from "src/auth/entities/user.entity";
import { Post } from "src/posts/entities/post.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'comments' })
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({
    })
    createDate: Date;

    @CreateDateColumn({
    })
    updateDate: Date;

    @Column('text', {
        default: ''
    })
    content: string;


    @Column('bool', { default: true })
    isActive: boolean;

    @Column('int', {
        default: 0
    })
    reports: number;

    @ManyToOne(
        () => Post,
        (post) => post.comments,
        {eager: true, cascade: true,}
        
    )
    post: Post;
    
    @ManyToOne(
        () => User,
        (user) => user.comments,
        { onDelete: 'CASCADE' }
    )
    user: User;

    
}
