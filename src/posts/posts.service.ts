import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, BeforeInsert, DataSource } from 'typeorm';
import { Post } from './entities/post.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { PostImage } from './entities/post-image.entity';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class PostsService {

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    
    @InjectRepository(PostImage)
    private readonly postImageRepository: Repository<PostImage>,

    private readonly dataSource: DataSource,
  ) { }

  async create(createPostDto: CreatePostDto, user : User) {
    
    try {
      const { images = [], ...postDetails } = createPostDto;
      const newpost = this.postRepository.create({
        ...postDetails,
        images: images.map(image => this.postImageRepository.create({ url: image })),
        user
      });
      const post = await this.postRepository.save(newpost);

      return {...post, images };

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0, country, uni } = paginationDto;
    if (limit < 0 || offset < 0) {
      throw new Error('Limit y offset deben ser valores no negativos.');
    }
    let posts;

    try {
      posts = await this.postRepository
          .createQueryBuilder('post')
          .where('post.reports < 10 AND post.isActive = true')
          .orderBy('post.createDate', 'DESC')
          .leftJoinAndSelect('post.images', 'image')
          .leftJoinAndSelect('post.user','user')
          .leftJoinAndSelect('post.comments', 'comment', 'comment.isActive = true')
          .leftJoinAndSelect('comment.user', 'commentUser')
          .getMany();
    } catch (error) {
      console.error('Error en la consulta: ', error);
      throw new Error('Error en la consulta de posts.');
    }

    if (country) {
      posts = posts.filter(post => post.user.country && post.user.country.includes(country));
    }
    
    if (uni) {
      posts = posts.filter(post => post.user.uni && post.user.uni.includes(uni));
    }

    posts = posts.slice(offset, offset + limit);

    return posts.map(post => ({ ...post, images: post.images.map(image => image.url) }));
  }

  async findOne(term: string) {
    let post: Post;

    if (isUUID(term)) {
      post = await this.postRepository
        .createQueryBuilder('post')
        .where('post.id = :id', { id: term })
        .leftJoinAndSelect('post.images', 'image')
        .leftJoinAndSelect('post.comments', 'comment', 'comment.isActive = true')
        .leftJoinAndSelect('comment.user', 'commentUser')
        .leftJoinAndSelect('post.user','user')
        .getOne();
    }

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async findOnePlain(term: string) {
    const {images=[],...res} = await this.findOne(term);
    return{
      ...res,
      images: images.map(image => image.url)
    }
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const {images, ...toUpdate} = updatePostDto;
    const post = await this.postRepository.preload({
      id,
      ...toUpdate
    })
    if (!post) throw new NotFoundException('Post not found');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(PostImage, { post: { id } });
        post.images = images.map(image => this.postImageRepository.create({ url: image }));
      }

      await queryRunner.manager.save(post);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBException(error);
    }

  }

  async remove(id: string) {
    const post = await this.findOne(id);
    await this.postRepository.remove(post);
    return `This action removes a #${id} post`;
  }

  private handleDBException(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    console.log(error);
    throw new InternalServerErrorException('Error creating post');
  }
}
