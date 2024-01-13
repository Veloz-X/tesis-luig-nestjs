import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PostImage } from "./post-image.entity";
import { User } from "src/auth/entities/user.entity";

@Entity({ name: 'posts' })
export class Post {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        default: ''
    })
    content: string;

    @Column('text', {
        default: ''
    })
    campus: string;

    @Column('bool', { default: true })
    isActive: boolean;

    @Column('bool', { default: false })
    isAnonymous: boolean;

    @CreateDateColumn({
    })
    createDate: Date;

    @UpdateDateColumn({
    })
    updateDate: Date;
    // TODO: REVISAR SI FUNCINA ESTO UpdateDateColumn

    @Column('int', {
        default: 0
    })
    reports: number;

    @Column('text', {
        array: true,
        default: '{other}'
    })
    categories: string[];

    @OneToMany(
        () => PostImage,
        (postImage) => postImage.post,
        { cascade: true, eager: true}
    )
    images?: PostImage[];

}
