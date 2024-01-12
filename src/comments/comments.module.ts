import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { PostsModule } from 'src/posts/posts.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [
    AuthModule,
    PostsModule,
    TypeOrmModule.forFeature([
      Comment
    ])
  ],
  exports: [CommentsService,TypeOrmModule ]
})
export class CommentsModule {}
