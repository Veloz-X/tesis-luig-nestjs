import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostImage } from './entities/post-image.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Post,PostImage
    ])
  ],
  exports: [PostsService,TypeOrmModule ]
})
export class PostsModule {}
