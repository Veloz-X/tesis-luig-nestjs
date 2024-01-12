import { Comment } from "src/comments/entities/comment.entity";
import { Post } from "src/posts/entities/post.entity";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column('text',{
        select: false
    })
    password: string;

    @Column('text', { default: '' })
    country: string;

    @Column('text', { default: '' })
    uni: string;

    @Column('text', { default: '' })
    gender: string;

    @Column('int', { default: 0 })
    age: number;

    @Column('bool', { default: true })
    isActive: boolean;

    @Column('text', { array: true, default: ['user'] })
    roles: string[];

    @CreateDateColumn({
    })
    createDate: Date;

    @UpdateDateColumn({
    })
    updateDate: Date;
    // TODO: REVISAR SI FUNCINA ESTO UpdateDateColumn

    @OneToMany(
        () => Post,
        (Userpost) => Userpost.user,
        // {
        //     cascade: true,
        //     eager: true
        // }
    )
    post: Post;
    
    @OneToMany(
        () => Comment,
        (Usercomment) => Usercomment.user,
        // {
        //     cascade: true,
        //     eager: true
        // }
    )
    comments: Comment[];


    @BeforeInsert()
    checkEmailInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkEmailUpdate() {
        this.email = this.email.toLowerCase().trim();
    }

}
