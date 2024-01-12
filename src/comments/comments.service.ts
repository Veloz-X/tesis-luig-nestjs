import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class CommentsService {

  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

  ) { }

  async create(postId: string , createCommentDto: CreateCommentDto, user : User) {
    // console.log('user', user);
    try {
      const post = await this.postRepository.findOne({
        where: { id: postId },
      });
      // console.log('post', post);

      if (!post) {
        throw new BadRequestException('Post not found');
      }

      const newComment = this.commentRepository.create({
        ...createCommentDto,
        post: post,
        user: user,
      });

      const comment = await this.commentRepository.save(newComment);

      return comment;
    } catch (error) {

      this.handleDBException(error);
    }
  }

  findAll() {
    return `This action returns all comments ...`;
  }

  findOne(id: string) {
    return `This action returns a #${id} comment`;
  }

  update(id: string, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action eliminar a #${id} comment`;
  }

  private handleDBException(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    console.log(error);
    throw new InternalServerErrorException('Error creating comment');
  }
}
